// Configuration - Replace with your Google Maps API key
const GOOGLE_MAPS_API_KEY = 'AIzaSyA93t3OOeXQtlidNwCKq7xaRtg6FVTvxFw';

// DOM Elements
const locateBtn = document.getElementById('locateBtn');
const resultsContainer = document.getElementById('resultsContainer');
const addressDisplay = document.getElementById('addressDisplay');
const coordinatesDisplay = document.getElementById('coordinatesDisplay');
const loadingOverlay = document.getElementById('loadingOverlay');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const clockElement = document.getElementById('clock');

// Update clock
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    clockElement.textContent = `${hours}:${minutes}`;
}

// Initialize clock
updateClock();
setInterval(updateClock, 1000);

// Show error message
function showError(message) {
    errorText.textContent = message;
    errorMessage.classList.add('visible');
    setTimeout(() => {
        errorMessage.classList.remove('visible');
    }, 5000);
}

// Show loading overlay
function showLoading() {
    loadingOverlay.classList.add('visible');
}

// Hide loading overlay
function hideLoading() {
    loadingOverlay.classList.remove('visible');
}

// Format coordinates
function formatCoordinate(value, isLatitude) {
    const absolute = Math.abs(value);
    const degrees = Math.floor(absolute);
    const minutesDecimal = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesDecimal);
    const seconds = ((minutesDecimal - minutes) * 60).toFixed(2);
    
    const direction = isLatitude 
        ? (value >= 0 ? 'N' : 'S')
        : (value >= 0 ? 'E' : 'W');
    
    return `${degrees}° ${minutes}' ${seconds}" ${direction}`;
}

// Get address from coordinates using Google Geocoding API
async function getAddressFromCoordinates(latitude, longitude) {
    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
        );
        
        if (!response.ok) {
            throw new Error('Geocoding request failed');
        }
        
        const data = await response.json();
        
        if (data.status === 'OK' && data.results.length > 0) {
            // Extract postal code from all results (sometimes it's in a different result)
            let postalCode = '';
            let streetAddress = '';
            let city = '';
            let country = '';
            
            // Try to find postal code in any of the results
            for (let result of data.results) {
                result.address_components.forEach(component => {
                    if (component.types.includes('postal_code') && !postalCode) {
                        postalCode = component.long_name;
                    }
                    if (component.types.includes('locality') && !city) {
                        city = component.long_name;
                    }
                    if (component.types.includes('country') && !country) {
                        country = component.long_name;
                    }
                });
                
                if (postalCode) break; // Stop once we find a postal code
            }
            
            // Get formatted address from first result
            streetAddress = data.results[0].formatted_address;
            
            return { streetAddress, postalCode, city, country };
        } else if (data.status === 'REQUEST_DENIED') {
            throw new Error('API key is invalid or not configured properly');
        } else {
            throw new Error('Unable to find address for this location');
        }
    } catch (error) {
        console.error('Geocoding error:', error);
        throw error;
    }
}

// Display location information
function displayLocation(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    
    // Display coordinates immediately
    coordinatesDisplay.innerHTML = `
        <div class="coordinate-line">
            <span class="coordinate-label">Latitude:</span>
            <span class="coordinate-value">${formatCoordinate(latitude, true)}</span>
        </div>
        <div class="coordinate-line">
            <span class="coordinate-label">Longitude:</span>
            <span class="coordinate-value">${formatCoordinate(longitude, false)}</span>
        </div>
        <div class="coordinate-line">
            <span class="coordinate-label">Decimal:</span>
            <span class="coordinate-value">${latitude.toFixed(6)}, ${longitude.toFixed(6)}</span>
        </div>
    `;
    
    // Show results container
    resultsContainer.classList.add('visible');
    
    // Get address
    addressDisplay.innerHTML = '<div class="loading-text">Decoding location...</div>';
    
    getAddressFromCoordinates(latitude, longitude)
        .then(({ streetAddress, postalCode, city, country }) => {
            let addressHTML = `<div style="margin-bottom: 15px;"><strong>Address:</strong><br>${streetAddress}</div>`;
            
            if (postalCode) {
                addressHTML += `<div style="margin-bottom: 10px; padding: 10px; background: rgba(0, 212, 212, 0.1); border-left: 3px solid #00d4d4; border-radius: 5px;">
                    <strong style="color: #b8860b; font-size: 16px;">Postal Code:</strong> 
                    <span style="color: #00ffff; font-size: 18px; font-weight: bold; text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);">${postalCode}</span>
                </div>`;
            } else {
                addressHTML += `<div style="margin-bottom: 10px; padding: 10px; background: rgba(139, 0, 0, 0.2); border-left: 3px solid #ff4444; border-radius: 5px;">
                    <strong>Postal Code:</strong> <em>Not available for this location</em>
                </div>`;
            }
            
            if (city) {
                addressHTML += `<div style="margin-top: 10px;"><strong>City:</strong> ${city}</div>`;
            }
            
            addressDisplay.innerHTML = addressHTML;
        })
        .catch(error => {
            addressDisplay.innerHTML = `<div class="error-text">Unable to retrieve address: ${error.message}</div>`;
            
            if (error.message.includes('API key')) {
                showError('Please configure your Google Maps API key in script.js');
            }
        })
        .finally(() => {
            hideLoading();
        });
}

// Handle geolocation error
function handleLocationError(error) {
    hideLoading();
    
    let errorMsg = '';
    
    switch(error.code) {
        case error.PERMISSION_DENIED:
            errorMsg = 'Location access denied. Please enable location permissions.';
            break;
        case error.POSITION_UNAVAILABLE:
            errorMsg = 'Location information unavailable.';
            break;
        case error.TIMEOUT:
            errorMsg = 'Location request timed out.';
            break;
        default:
            errorMsg = 'An unknown error occurred.';
            break;
    }
    
    showError(errorMsg);
    
    addressDisplay.innerHTML = `<div class="error-text">${errorMsg}</div>`;
    coordinatesDisplay.innerHTML = `<div class="error-text">Unable to retrieve coordinates</div>`;
    resultsContainer.classList.add('visible');
}

// Get user location
function getUserLocation() {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser');
        return;
    }
    
    // Check if API key is configured
    if (GOOGLE_MAPS_API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
        showError('Please configure your Google Maps API key in script.js');
        
        // Still show coordinates without address
        showLoading();
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                
                coordinatesDisplay.innerHTML = `
                    <div class="coordinate-line">
                        <span class="coordinate-label">Latitude:</span>
                        <span class="coordinate-value">${formatCoordinate(latitude, true)}</span>
                    </div>
                    <div class="coordinate-line">
                        <span class="coordinate-label">Longitude:</span>
                        <span class="coordinate-value">${formatCoordinate(longitude, false)}</span>
                    </div>
                    <div class="coordinate-line">
                        <span class="coordinate-label">Decimal:</span>
                        <span class="coordinate-value">${latitude.toFixed(6)}, ${longitude.toFixed(6)}</span>
                    </div>
                `;
                
                addressDisplay.innerHTML = '<div class="error-text">Configure API key to see address</div>';
                resultsContainer.classList.add('visible');
                hideLoading();
            },
            handleLocationError,
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
        return;
    }
    
    showLoading();
    
    navigator.geolocation.getCurrentPosition(
        displayLocation,
        handleLocationError,
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

// Event listener for locate button
locateBtn.addEventListener('click', getUserLocation);

// Add button click animation
locateBtn.addEventListener('mousedown', () => {
    locateBtn.style.transform = 'scale(0.95)';
});

locateBtn.addEventListener('mouseup', () => {
    locateBtn.style.transform = 'scale(1.05)';
    setTimeout(() => {
        locateBtn.style.transform = 'scale(1)';
    }, 100);
});
