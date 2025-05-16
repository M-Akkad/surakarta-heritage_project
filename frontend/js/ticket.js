document.addEventListener('DOMContentLoaded', () => {
    // Ensure auth.js is loaded and API_BASE_URL is available
    if (typeof API_BASE_URL === 'undefined' || typeof fetchWithAuth === 'undefined') {
        console.error("auth.js or config.js might not be loaded correctly.");
        // Potentially redirect to login or show a critical error
        // For now, we assume they are loaded if we are on index.html (due to auth.js redirection)
    }

    const issueTicketForm = document.getElementById('issueTicketForm');
    const backToFormButton = document.getElementById('backToFormButton');
    const printTicketButton = document.getElementById('printTicketButton');
    
    const issueTicketView = document.getElementById('issueTicketView');
    const ticketGeneratedView = document.getElementById('ticketGeneratedView');

    if (issueTicketForm) {
        issueTicketForm.addEventListener('submit', handleIssueTicket);
    }
    if (backToFormButton) {
        backToFormButton.addEventListener('click', (e) => {
            e.preventDefault();
            showIssueTicketView();
        });
    }
    if (printTicketButton) {
        printTicketButton.addEventListener('click', () => window.print());
    }

    // Initial check for pending tickets
    syncPendingTickets();
    updatePendingIndicator();
});

async function handleIssueTicket(event) {
    event.preventDefault();
    const ticketErrorElement = document.getElementById('ticketError');
    ticketErrorElement.style.display = 'none';
    ticketErrorElement.textContent = '';

    const ticketData = {
        visitor_type: document.getElementById('visitorType').value,
        age_group: document.getElementById('ageGroup').value || "", // Send empty string if not selected
        gender: document.getElementById('gender').value || "", // Send empty string if not selected
        location_name: document.getElementById('locationName').value, // Hidden field
        location_coords: document.getElementById('locationCoords').value, // Hidden field
    };

    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/tickets`, {
            method: 'POST',
            body: ticketData
        });

        if (response.ok) {
            const newTicket = await response.json();
            displayGeneratedTicket(newTicket);
            issueTicketForm.reset(); 
        } else {
            const errorData = await response.json().catch(() => ({ detail: "Failed to issue ticket. Please try again." }));
            console.error("Ticket issue error (server):");
            handleTicketIssueError(ticketData, errorData.detail);
        }
    } catch (error) {
        console.error('Network or Auth error issuing ticket:', error);
        // This catch block handles network errors or auth errors from fetchWithAuth
        handleTicketIssueError(ticketData, "Network error or authentication issue. Ticket saved locally.");
    }
}

function handleTicketIssueError(ticketData, errorMessage) {
    const ticketErrorElement = document.getElementById('ticketError');
    ticketErrorElement.textContent = errorMessage;
    ticketErrorElement.style.display = 'block';
    
    // Save ticket to pending queue
    addTicketToPendingQueue(ticketData);
    alert("Could not connect to the server. The ticket has been saved locally and will be synced when online.");
    // Optionally, still show a locally generated "ticket" but mark it as pending
    // For simplicity, we're just showing an error and queuing.
    // If you want to show the ticket generated view even offline, you would call displayGeneratedTicket
    // with local data and an indication it's not synced yet.
}

function displayGeneratedTicket(ticket) {
    document.getElementById('ticketVisitorType').textContent = ticket.visitor_type || 'N/A';
    document.getElementById('ticketAgeGroup').textContent = ticket.age_group || 'N/A';
    document.getElementById('ticketGender').textContent = ticket.gender || 'N/A';
    document.getElementById('ticketIssuedAt').textContent = new Date(ticket.issued_at).toLocaleString();
    
    // The schema has id: int, but image shows alphanumeric. Using id as is for now.
    // If it needs to be a specific format like hex, that conversion would happen here.
    const ticketIdString = ticket.id ? ticket.id.toString() : "LOCAL-" + Date.now();
    document.getElementById('ticketIdDisplay').textContent = ticketIdString;

    // Generate QR Code
    const qrCodeImage = document.getElementById('qrCodeImage');
    try {
        const typeNumber = 4; // Complexity/size of QR code
        const errorCorrectionLevel = 'L'; // Low, Medium, Quartile, High
        const qr = qrcode(typeNumber, errorCorrectionLevel);
        // Content for QR code: could be ticket ID, a URL, or JSON stringified ticket data
        const qrContent = JSON.stringify({ 
            id: ticketIdString, 
            visitor_type: ticket.visitor_type,
            issued_at: ticket.issued_at 
        });
        qr.addData(qrContent);
        qr.make();
        qrCodeImage.src = qr.createDataURL(10, 0); // (cellSize, margin)
    } catch (err) {
        console.error("Error generating QR code: ", err);
        qrCodeImage.alt = "Error generating QR code";
        qrCodeImage.src = ""; // Clear if error
    }

    showTicketGeneratedView();
}

function showIssueTicketView() {
    document.getElementById('issueTicketView').style.display = 'block';
    document.getElementById('ticketGeneratedView').style.display = 'none';
}

function showTicketGeneratedView() {
    document.getElementById('issueTicketView').style.display = 'none';
    document.getElementById('ticketGeneratedView').style.display = 'block';
}

// --- Offline Pending Queue Logic ---
function getPendingTickets() {
    return JSON.parse(localStorage.getItem('pendingTickets')) || [];
}

function savePendingTickets(tickets) {
    localStorage.setItem('pendingTickets', JSON.stringify(tickets));
    updatePendingIndicator();
}

function addTicketToPendingQueue(ticketData) {
    const pendingTickets = getPendingTickets();
    // Add a timestamp for when it was queued locally
    pendingTickets.push({ ...ticketData, queued_at: new Date().toISOString(), attempt: 0 });
    savePendingTickets(pendingTickets);
}

async function syncPendingTickets() {
    const pendingTickets = getPendingTickets();
    if (pendingTickets.length === 0) return;

    console.log(`Attempting to sync ${pendingTickets.length} pending tickets.`);
    const stillPending = [];

    for (const ticketData of pendingTickets) {
        ticketData.attempt = (ticketData.attempt || 0) + 1;
        try {
            // We only need the original ticketData fields for submission
            const submissionData = {
                visitor_type: ticketData.visitor_type,
                age_group: ticketData.age_group,
                gender: ticketData.gender,
                location_name: ticketData.location_name,
                location_coords: ticketData.location_coords
            };

            const response = await fetchWithAuth(`${API_BASE_URL}/tickets`, {
                method: 'POST',
                body: submissionData
            });

            if (response.ok) {
                console.log("Successfully synced a pending ticket:", await response.json());
            } else {
                // If server rejects (e.g. 400, 500), it might be a permanent issue or temporary
                // For now, keep retrying. More sophisticated logic could stop after N attempts or for certain errors.
                console.warn("Failed to sync a ticket, server responded with error:", response.status);
                if (ticketData.attempt < 5) { // Max 5 attempts
                   stillPending.push(ticketData);
                } else {
                    console.error("Max attempts reached for a pending ticket. Discarding:", ticketData);
                }
            }
        } catch (error) {
            // Network error, keep for next sync attempt
            console.warn("Network error during pending ticket sync, will retry:", error);
            if (ticketData.attempt < 5) { // Max 5 attempts
               stillPending.push(ticketData);
            } else {
                console.error("Max attempts reached for a pending ticket due to network issues. Discarding:", ticketData);
            }
        }
    }
    savePendingTickets(stillPending);
    if (stillPending.length < pendingTickets.length && stillPending.length > 0) {
        alert(`${pendingTickets.length - stillPending.length} ticket(s) synced. ${stillPending.length} still pending.`);
    } else if (stillPending.length === 0 && pendingTickets.length > 0) {
        alert("All pending tickets have been synced successfully!");
    }
}

function updatePendingIndicator() {
    const pendingTickets = getPendingTickets();
    const indicator = document.getElementById('pendingSyncIndicator');
    const countElement = document.getElementById('pendingCount');

    if (indicator && countElement) {
        if (pendingTickets.length > 0) {
            countElement.textContent = pendingTickets.length;
            indicator.style.display = 'flex'; // Or 'block', depending on your CSS for it
        } else {
            indicator.style.display = 'none';
        }
    }
}

// Periodically try to sync if there are pending tickets and user is online
// This is a simple interval. More robust solutions might use online/offline events.
setInterval(() => {
    if (navigator.onLine) {
        syncPendingTickets();
    }
}, 60000); // Sync every 1 minute 