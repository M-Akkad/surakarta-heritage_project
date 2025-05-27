import React, { useState, useEffect, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { authFetch, API_BASE } from '../api.js'

export default function EditTicket()
{
    const { token } = useContext(AuthContext)
    const fetcher = authFetch(token)
    const navigate = useNavigate()
    const { id } = useParams()

    const [form, setForm] = useState({
        visitor_type: 'tourist',
        age_group: 'adult',
        gender: 'male',
        location_name: 'Kraton'
    })

    const [error, setError] = useState(null)

    useEffect(() =>
    {
        fetcher(`/tickets/${id}`)
            .then(data => setForm(data))
            .catch(err => setError(err.detail || err.message))
    }, [id])


    const handleChange = e =>
    {
        const { name, value } = e.target
        setForm(f => ({ ...f, [name]: value }))
    }

    const handleSubmit = async e =>
    {
        e.preventDefault()
        setError(null)
        try
        {
            await fetcher(`/tickets/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            })
            navigate('/tickets')
        } catch (err)
        {
            setError(err.detail || err.message)
        }
    }

    return (
        <div className="container-fluid px-3">
            <div className="card mx-auto my-4 shadow-sm" style={{ width: '100%', maxWidth: 600 }}>
                <div className="card-header"><h5>Edit Ticket #{id}</h5></div>
                <div className="card-body">
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        {['visitor_type', 'age_group', 'gender', 'location_name'].map(field => (
                            <div key={field} className="mb-3">
                                <label className="form-label text-capitalize">{field.replace('_', ' ')}</label>
                                <select name={field} className="form-select" value={form[field]}
                                    onChange={handleChange}>
                                    {field === 'visitor_type' && (
                                        <>
                                            <option value="tourist">Tourist</option>
                                            <option value="local">Local</option>
                                        </>
                                    )}
                                    {field === 'age_group' && (
                                        <>
                                            <option value="child">Child</option>
                                            <option value="adult">Adult</option>
                                            <option value="senior">Senior</option>
                                        </>
                                    )}
                                    {field === 'gender' && (
                                        <>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </>
                                    )}
                                    {field === 'location_name' && (
                                        <>
                                            <option value="Kraton">Kraton</option>
                                            <option value="Pura Mangkunegaran">Pura Mangkunegaran</option>
                                            <option value="Pasar Triwindu">Pasar Triwindu</option>
                                        </>
                                    )}
                                </select>
                            </div>
                        ))}
                        <button className="btn btn-primary">Save Changes</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
