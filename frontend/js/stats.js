document.addEventListener('DOMContentLoaded', async () => {
    // Ensure auth.js is loaded and API_BASE_URL is available
    if (typeof API_BASE_URL === 'undefined' || typeof fetchWithAuth === 'undefined') {
        console.error("auth.js or config.js might not be loaded correctly for stats page.");
        // Potentially redirect to login or show a critical error
        return;
    }

    // Check if user is admin before loading stats (auth.js should also do this, but as a safeguard)
    const user = getUser(); // from auth.js
    if (!user || user.role !== 'admin') {
        console.warn("Non-admin user tried to access stats. Redirecting if not already handled.");
        // auth.js should handle redirection, this is an additional check.
        if (!window.location.pathname.endsWith(APP_PAGE)) {
             // window.location.href = APP_PAGE; // auth.js should handle this
        }
        return; 
    }

    await loadStatistics();
    updatePendingIndicator(); // From ticket.js
});

async function loadStatistics() {
    try {
        // 1. Fetch main statistics
        const response = await fetchWithAuth(`${API_BASE_URL}/stats`);
        if (!response.ok) {
            throw new Error(`Failed to fetch stats: ${response.statusText}`);
        }
        const statsData = await response.json();

        document.getElementById('totalVisitors').textContent = statsData.total || 0;

        // 2. Fetch Local, International, and Today's visitor counts
        // These require separate calls to /api/tickets/search as discussed

        const today = new Date(); 
        const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString().split('T')[0];
        const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString().split('T')[0]; // Next day at 00:00

        const [localCount, internationalCount, todayCount] = await Promise.all([
            getFilteredTicketCount({ visitor_type: 'Local' }),
            getFilteredTicketCount({ visitor_type: 'International' }),
            getFilteredTicketCount({ start_date: startDate, end_date: endDate })
        ]);

        document.getElementById('localVisitors').textContent = localCount;
        document.getElementById('internationalVisitors').textContent = internationalCount;
        document.getElementById('todayVisitors').textContent = todayCount;

        // 3. Populate Age Group Distribution
        populateDistributionList(
            document.getElementById('ageGroupDistribution'),
            statsData.by_age_group || {},
            statsData.total,
            true // isAgeGroup
        );

        // 4. Populate Gender Distribution
        populateDistributionList(
            document.getElementById('genderDistribution'),
            statsData.by_gender || {},
            statsData.total,
            false // isAgeGroup
        );

    } catch (error) {
        console.error('Error loading statistics:', error);
        alert('Failed to load statistics. Please try again later. ' + error.message);
    }
}

async function getFilteredTicketCount(filters) {
    const queryParams = new URLSearchParams();
    if (filters.visitor_type) queryParams.append('visitor_type', filters.visitor_type);
    if (filters.start_date) queryParams.append('start_date', filters.start_date);
    if (filters.end_date) queryParams.append('end_date', filters.end_date);
    // Add other filters like age_group, location_name if needed for this count

    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/tickets/search?${queryParams.toString()}`);
        if (!response.ok) {
            console.error(`Failed to fetch filtered tickets for ${JSON.stringify(filters)}: ${response.status}`);
            return 0; // Return 0 on error
        }
        const tickets = await response.json();
        return tickets.length; // Assuming the endpoint returns a list of tickets
    } catch (error) {
        console.error(`Error in getFilteredTicketCount for ${JSON.stringify(filters)}:`, error);
        return 0; // Return 0 on error
    }
}

function populateDistributionList(listElement, data, total, isAgeGroup) {
    if (!listElement) return;
    listElement.innerHTML = ''; // Clear existing items

    const ageGroupColors = {
        "Child": "child",
        "Adult": "adult",
        "Elderly": "elderly"
    };
    const genderColors = {
        "Male": "male",
        "Female": "female",
        "Other": "other"
    };

    const sortedData = Object.entries(data).sort(([, a], [, b]) => b - a); // Sort by count desc

    for (const [key, count] of sortedData) {
        if (key === "" || key === null || key === undefined) continue; // Skip empty keys
        const percentage = total > 0 ? ((count / total) * 100).toFixed(0) : 0;
        const li = document.createElement('li');

        let barClass = 'default';
        if (isAgeGroup) {
            barClass = ageGroupColors[key] || 'default';
        } else {
            barClass = genderColors[key] || 'default';
        }

        li.innerHTML = `
            <div class="distribution-item">
                <span class="distribution-label">${key}</span>
                <span class="distribution-value">${count} (${percentage}%)</span>
            </div>
            <div class="progress-bar-container">
                <div class="progress-bar ${barClass}" style="width: ${percentage}%;"></div>
            </div>
        `;
        listElement.appendChild(li);
    }
    if (listElement.innerHTML === '') {
        listElement.innerHTML = '<li>No data available.</li>';
    }
}

// Removed duplicate updatePendingIndicator function
// It will use the one from ticket.js (now included in statistics.html) 