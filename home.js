// --- 1. FUNCTION TO SWITCH SECTIONS (Home, Profile, etc.) ---
function showSection(sectionId) {
    // Hide all sections first
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(sec => {
        sec.style.display = 'none';
    });

    // Show the specific section you clicked
    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.style.display = 'block';
    }
}

// --- 2. FUNCTION TO FILTER TRIPS (Confirmed, Cancelled, Completed) ---
function filterTrips(status) {
    // 1. Hide ALL lists first
    document.getElementById('confirmed').style.display = 'none';
    document.getElementById('cancelled').style.display = 'none';
    document.getElementById('completed').style.display = 'none';

    // 2. Remove 'active-tab' color from ALL buttons
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active-tab'));

    // 3. Show ONLY the one you clicked
    const selectedList = document.getElementById(status);
    if (selectedList) {
        // IMPORTANT: We use 'flex' here so the cards stay side-by-side!
        selectedList.style.display = 'flex'; 
    }

    // 4. Highlight the button you just clicked
    // This finds the button that has the onclick="filterTrips('...')" matching your status
    const clickedButton = document.querySelector(`button[onclick="filterTrips('${status}')"]`);
    if (clickedButton) {
        clickedButton.classList.add('active-tab');
    }
}

// --- 3. CHECK LOGIN STATUS (Security) ---
// If the user tries to open home.html without logging in, send them back to login.
window.onload = function() {
    const user = localStorage.getItem('registeredUser');
    if (!user) {
        // If no user is found, kick them back to login
        window.location.href = 'register.html'; 
    } else {
        // If user exists, show their name
        const userData = JSON.parse(user);
        // Assuming you have an element <h1 id="welcomeName"></h1>
        const welcomeElement = document.getElementById('welcomeName'); // Optional
        if(welcomeElement) welcomeElement.innerText = "Welcome " + userData.firstName;
    }
};

// --- 4. LOGOUT FUNCTION ---
function logout() {
    // Optional: Clear data if you want, or just redirect
    window.location.href = 'register.html'; // Go back to login page
}

/* --- FLIGHT SEARCH & DROPDOWN LOGIC --- */

// 1. Handle Custom Dropdowns (Open/Close)
function toggleDropdown(id) {
    const list = document.getElementById(id);
    // Close other lists first if you want (optional)
    if (list.style.display === "block") {
        list.style.display = "none";
    } else {
        list.style.display = "block";
    }
}

// Function to handle selecting a class (Economy, Business, etc.)
function selectClass(className) {
    // 1. Update the visible text on the button
    document.getElementById('selected-class-text').innerText = className;
    
    // 2. Update the hidden input value (so the correct data is sent when booking)
    document.getElementById('class-input').value = className;
    
    // 3. Close the dropdown (using your existing logic style)
    const list = document.getElementById('class-options-list');
    if (list) {
        list.style.display = 'none';
    }
}
// 2. Handle Option Selection
function selectOption(textElementId, value, listId) {
    // Update the text (e.g., "Select Origin" -> "Mumbai")
    document.getElementById(textElementId).innerText = value;
    document.getElementById(textElementId).dataset.value = value; // Store value for logic
    
    // Hide the list again
    document.getElementById(listId).style.display = "none";
}

// 3. Search Validation & Mock Results
function validateSearch() {
    // Get values from our custom storage (dataset) or inputs
    const origin = document.getElementById('originText').innerText;
    const dest = document.getElementById('destText').innerText;
    const date = document.getElementById('deptDate').value;

    // Check if user actually selected something
    if (origin === "Select Origin" || dest === "Select Destination") {
        showAlert("Please select both Origin and Destination.");
        return;
    }
    if (origin === dest) {
        showAlert("Origin and Destination cannot be the same!");
        return;
    }
    if (!date) {
        showAlert("Please select a travel date.");
        return;
    }

    // If all good, Show Results!
    showFlightResults(origin, dest, date);
}

// 4. Generate & Show Flight Cards
function showFlightResults(from, to, date) {
    // Hide Form, Show Results
    document.getElementById('searchFormSection').style.display = 'none';
    document.getElementById('searchResultsSection').style.display = 'block';

    const resultsList = document.getElementById('resultsList');
    resultsList.innerHTML = ""; // Clear old results

    // Create 3 Dummy Flights
    const airlines = ["Kapitt. Vimaan", "Air India", "Vistara"];
    const times = ["08:00 AM", "02:30 PM", "09:45 PM"];
    const prices = ["₹4,500", "₹5,200", "₹3,800"];

    // Loop to create HTML for each flight
    for (let i = 0; i < 3; i++) {
        const card = `
            <div class="boarding-pass" style="width:100%; height:auto; min-height:180px; margin-bottom:20px;">
                <div class="pass-left" style="width:70%;">
                    <div class="airline-name">${airlines[i]}</div>
                    <div class="flight-route">
                        <h1 style="font-size:24px;">${from.substring(0,3).toUpperCase()}</h1> 
                        <i class='bx bxs-plane' style="transform: rotate(90deg); color:#4facfe;"></i> 
                        <h1 style="font-size:24px;">${to.substring(0,3).toUpperCase()}</h1>
                    </div>
                    <div class="flight-details">
                        <div><span>DATE</span><br>${date}</div>
                        <div><span>TIME</span><br>${times[i]}</div>
                        <div><span>PRICE</span><br>${prices[i]}</div>
                    </div>
                </div>
                <div class="pass-right" style="width:30%; cursor:pointer;" onclick="alert('Booking confirmed for ${airlines[i]}!')">
                    <span style="font-size:14px; font-weight:bold;">BOOK</span>
                    <i class='bx bxs-check-circle' style="font-size:30px; margin-top:10px;"></i>
                </div>
            </div>
        `;
        resultsList.innerHTML += card;
    }
}

// 5. Back Button Logic
function backToSearch() {
    document.getElementById('searchResultsSection').style.display = 'none';
    document.getElementById('searchFormSection').style.display = 'block';
}

// Close dropdowns if clicking outside (Optional Polish)
window.onclick = function(event) {
    
    // --- PART 1: Handle Old Dropdowns (Origin/Destination) ---
    // Checks for '.dropdown-btn'
    if (!event.target.matches('.dropdown-btn') && !event.target.matches('.dropdown-btn *')) {
        const oldDropdowns = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < oldDropdowns.length; i++) {
            if (oldDropdowns[i].style.display === "block") {
                oldDropdowns[i].style.display = "none";
            }
        }
    }

    // --- PART 2: Handle New Class Dropdown ---
    // Checks if click is NOT inside the '.custom-dropdown' wrapper
    if (!event.target.closest('.custom-dropdown')) {
        const newDropdowns = document.getElementsByClassName("dropdown-options");
        for (let i = 0; i < newDropdowns.length; i++) {
            // We check style.display because your toggle function uses it
            if (newDropdowns[i].style.display === "block") {
                newDropdowns[i].style.display = "none";
            }
        }
    }
}

function cancelFlight(button) {
    if(confirm("Are you sure you want to cancel this flight?")) {
        // 1. Find the specific ticket card (Grandparent of button)
        const ticket = button.closest('.boarding-pass');
        
        // 2. Visual Animation (Fade out)
        ticket.style.opacity = '0';
        ticket.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            // 3. Remove from screen
            ticket.remove();
            
            // 4. (Optional) You could actually append it to the 'cancelled' div here
            // But for now, we just remove it to simulate cancellation.
            alert("Flight Cancelled Successfully. Refund Initiated.");
        }, 300);
    }
}

// --- DYNAMIC PASSENGER LIMIT LOGIC ---
function updateLimit() {
    // 1. Get the elements
    const classType = document.getElementById('classType').value;
    const travellersInput = document.getElementById('travellers');
    
    // 2. Define the limits
    let limit = 9; // Default for Economy

    if (classType === "Business") {
        limit = 2;
    } else if (classType === "Executive") {
        limit = 4;
    } else {
        limit = 9;
    }

    // 3. Update the 'max' attribute (stops the Up arrow)
    travellersInput.setAttribute("max", limit);

    // 4. AUTO-CORRECT: If user already typed 6 and switches to Business, force it down to 2
    if (parseInt(travellersInput.value) > limit) {
        showAlert("Note: " + classType + " Class is limited to " + limit + " travellers.");
        travellersInput.value = limit;
    }
}

// --- DASHBOARD LOAD LOGIC ---
window.addEventListener('load', function() {
    
    // 1. Get the Current User Name (for the header)
    const activeUser = localStorage.getItem('currentUser');
    
    // 2. Get the Full User Data (for the passport/profile section)
    const allData = JSON.parse(localStorage.getItem('registeredUser'));

    // SECURITY: If no one is logged in, kick them back to login
    if (!activeUser || !allData) {
        window.location.href = "login.html";
        return;
    }

    // --- A. UPDATE HEADER (Fixes "Loading...") ---
    const headerName = document.getElementById('headerUserName');
    if (headerName) {
        headerName.innerText = allData.firstName + " " + allData.lastName; 
    }

    // --- B. UPDATE WELCOME MESSAGE ---
    const welcomeMsg = document.getElementById('welcomeMsg');
    if (welcomeMsg) {
        welcomeMsg.innerText = "Welcome, " + allData.firstName + "!";
    }

    // --- C. UPDATE PASSPORT / PROFILE DETAILS (UPDATED FOR YOUR HTML) ---
    
    // 1. Full Name
    if (document.getElementById('dispName')) {
        document.getElementById('dispName').innerText = allData.firstName + " " + allData.lastName;
    }
    
    // 2. Email ID
    if (document.getElementById('dispEmail')) {
        document.getElementById('dispEmail').innerText = allData.email;
    }

    // 3. Date of Birth (Added this because your HTML has it)
    if (document.getElementById('dispDob')) {
        document.getElementById('dispDob').innerText = allData.dob;
    }

    // 4. Contact No (Changed 'passportPhone' to 'dispContact' and 'allData.phone' to 'allData.contact')
    if (document.getElementById('dispContact')) {
        document.getElementById('dispContact').innerText = allData.contact;
    }
    
});

// --- CUSTOM ALERT FUNCTION ---
function showAlert(message) {
    // 1. Set the message text
    document.getElementById('alertMessage').innerText = message;
    
    // 2. Show the overlay
    document.getElementById('customAlert').style.display = 'flex';
}

// --- CLOSE ALERT FUNCTION ---
function closeCustomAlert() {
    document.getElementById('customAlert').style.display = 'none';
}

// --- USER STORY 5: SEARCH & BOOK FLIGHT ---

// Function triggered when user clicks "Search" on Home Page
function searchFlights() {
    // 1. Get User Inputs from your existing Home Page Form
    // (Make sure your inputs in home.html have these IDs, or update these lines)
    const originInput = document.getElementById('origin').value; 
    const destInput = document.getElementById('destination').value;
    const dateInput = document.getElementById('travelDate').value;
    // Default to "Economy" if you don't have a category dropdown, or get the value
    const categoryInput = "Economy"; 

    // 2. Get Data from LocalStorage (Saved by Admin in Story 3)
    const flights = JSON.parse(localStorage.getItem('flightsList')) || [];

    // 3. Filter Flights
    const matchingFlights = flights.filter(f => 
        (f.origin.toLowerCase() === originInput.toLowerCase()) &&
        (f.destination.toLowerCase() === destInput.toLowerCase())
        // Note: We are matching Origin/Dest. Date matching can be added if Admin saves dates.
    );

    // 4. Render Table
    const resultsContainer = document.getElementById('searchResultsContainer');
    const tbody = document.getElementById('searchResultsBody');
    tbody.innerHTML = ''; // Clear previous results

    if (matchingFlights.length > 0) {
        resultsContainer.style.display = 'block';

        matchingFlights.forEach(f => {
            // Get seat count based on category (Defaulting to Economy for this demo)
            const seatCount = f.seats ? f.seats.economy : "N/A";

            const tr = document.createElement('tr');
            tr.style.borderBottom = "1px solid rgba(255,255,255,0.1)";
            
            tr.innerHTML = `
                <td style="padding: 10px;">${f.flightId}</td>
                <td style="padding: 10px;">${seatCount}</td>
                <td style="padding: 10px;">${categoryInput}</td>
                <td style="padding: 10px;">${dateInput || "Any Date"}</td>
                <td style="padding: 10px; text-align: center;">
                    <button onclick="bookFlight('${f.flightId}')" style="background: #4facfe; border: none; padding: 8px 15px; color: white; border-radius: 5px; cursor: pointer; font-weight: bold;">
                        Book
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } else {
        alert("No flights found for this route!");
        resultsContainer.style.display = 'none';
    }
}

// Function triggered when user clicks "Book"
function bookFlight(flightId) {
    // Requirement: Show message "Flight Id <FlightID> is booked successfully"
    
    const msgBox = document.getElementById('bookingSuccessMsg');
    msgBox.style.display = 'block';
    msgBox.innerText = `Flight Id ${flightId} is booked successfully`;

    // Hide message after 3 seconds
    setTimeout(() => {
        msgBox.style.display = 'none';
    }, 3000);
}

/* --- COPY PROMO CODE FUNCTION --- */
function copyCode(code) {
    navigator.clipboard.writeText(code);
    alert("Promo Code " + code + " copied to clipboard!");
}