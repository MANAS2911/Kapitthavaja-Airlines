// Global Variable
let systemPNR = "KPT882"; // Default backup for demo
let passengerLastName = "CHOUDHARY"; // Default backup

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
    window.location.href = 'index.html'; // Go back to login page
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
    // 1. Update the visible text
    const textSpan = document.getElementById('selected-class-text');
    if(textSpan) textSpan.innerText = className;
    
    // 2. Update the hidden input
    const hiddenInput = document.getElementById('class-input');
    if(hiddenInput) hiddenInput.value = className;
    
    // 3. Close the dropdown
    // We find the list and remove the 'active' class from its parent
    const list = document.getElementById('class-options-list');
    if(list && list.parentElement) {
        list.parentElement.classList.remove('active');
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


// 4. Generate & Show Flight Cards
// 4. Generate & Show Flight Cards
// 4. Generate & Show Flight Cards (FIXED)
function showFlightResults(from, to, date) {
    // 1. Switch Views
    document.getElementById('searchFormSection').style.display = 'none';
    document.getElementById('searchResultsSection').style.display = 'block';

    const resultsList = document.getElementById('resultsList');
    resultsList.innerHTML = ""; 

    // 2. Mock Data
    const airlines = ["Kapitt. Vimaan", "Air India", "Vistara"];
    const times = ["08:00 AM", "02:30 PM", "09:45 PM"];
    const prices = ["₹6,000", "₹7,500", "₹9,300"];
    const flightNums = ["KV-101", "AI-305", "UK-882"];

    // 3. Loop to create the 3 Wide Cards
    for (let i = 0; i < 3; i++) {
        const card = `
            <div class="flight-result-card">
                <div class="pass-left">
                    <div class="airline-name">${airlines[i]}</div>
                    <div class="flight-route">
                        <h1>${from.substring(0,3).toUpperCase()}</h1> 
                        <i class='bx bxs-plane' style="color:#4facfe;"></i> 
                        <h1>${to.substring(0,3).toUpperCase()}</h1>
                    </div>
                    <div class="flight-details">
                        <div><span>DATE</span><br>${date}</div>
                        <div><span>TIME</span><br>${times[i]}</div>
                        <div><span>FLIGHT</span><br>${flightNums[i]}</div>
                    </div>
                </div>

                <div class="pass-right">
                    <div class="seat-info">
                        <span>PRICE</span>
                        <h1 style="font-size: 24px;">${prices[i]}</h1>
                    </div>
                    
                    <button class="btn" onclick="confirmBooking('${flightNums[i]}', '${from}', '${to}')" 
                        style="margin-top:10px; width:auto; padding: 8px 20px; background:white; color:#4facfe; font-size:12px; font-weight:bold; border-radius:20px;">
                        BOOK NOW
                    </button>
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

/* --- DYNAMIC CANCELLATION LOGIC --- */

function cancelFlight(button) {
    // 1. Confirm Action
    if(!confirm("Are you sure you want to cancel this flight? This action cannot be undone.")) return;

    // 2. Identify the Ticket and the Destination Container
    const card = button.closest('.boarding-pass');
    const cancelledList = document.getElementById('cancelled');

    // 3. Animation: Fade Out from Confirmed List
    card.style.transition = "all 0.4s ease";
    card.style.opacity = "0";
    card.style.transform = "translateX(20px)";

    setTimeout(() => {
        // --- 4. TRANSFORM THE TICKET VISUALS ---

        // A. Change Right Side to RED
        const passRight = card.querySelector('.pass-right');
        passRight.style.background = "#ff4b4b"; // Red Color
        
        // B. Update Right Side Content (Keep QR, Remove Button)
        // We grab the existing QR code HTML so we don't lose it
        const qrCodeHTML = card.querySelector('.qr-area') ? card.querySelector('.qr-area').outerHTML : '';
        
        passRight.innerHTML = `
            <div class="seat-info">
                <span>STATUS</span>
                <h1>REF</h1>
            </div>
            ${qrCodeHTML}
            <div style="margin-top:10px; color:white; font-weight:bold; font-size:12px; display:flex; align-items:center; gap:5px;">
                <i class='bx bx-block' style="font-size:18px;"></i> REFUNDED
            </div>
        `;

        // C. Update Left Side (Gate -> Cancelled Status)
        const flightDetails = card.querySelector('.flight-details');
        // We replace the last detail (usually GATE) with STATUS
        const detailsDivs = flightDetails.querySelectorAll('div');
        if(detailsDivs.length > 0) {
            const lastDiv = detailsDivs[detailsDivs.length - 1];
            lastDiv.innerHTML = `<span>STATUS</span><br><b style="color:red;">CANCELLED</b>`;
        }

        // --- 5. MOVE TICKET TO CANCELLED TAB ---
        // Prepend adds it to the TOP of the cancelled list
        cancelledList.prepend(card); 

        // 6. Reset Animation (Fade In)
        card.style.opacity = "1";
        card.style.transform = "translateX(0)";

        // 7. Switch Tab to Show User
        filterTrips('cancelled');

    }, 400); // Wait 400ms for the fade-out to finish
}

/* --- TAB SWITCHING LOGIC (Required for the above to work) --- */
/* --- FIXED TAB SWITCHING LOGIC (Restores Grid Layout) --- */
/* --- FINAL FIXED TAB LOGIC (Centered Grid) --- */
function filterTrips(type) {
    // 1. Hide all lists
    document.getElementById('confirmed').style.display = 'none';
    document.getElementById('cancelled').style.display = 'none';
    document.getElementById('completed').style.display = 'none';

    // 2. Show the selected list
    const selectedList = document.getElementById(type);
    if (selectedList) {
        selectedList.style.display = 'flex'; 
        selectedList.style.flexDirection = 'row'; 
        selectedList.style.flexWrap = 'wrap';
        
        // --- THIS IS THE FIX: CHANGE 'flex-start' TO 'center' ---
        selectedList.style.justifyContent = 'center'; 
        
        selectedList.style.gap = '20px';
    }

    // 3. Update Tab Buttons
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active-tab');
        if (btn.textContent.toLowerCase().includes(type)) {
            btn.classList.add('active-tab');
        }
    });
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

window.addEventListener('click', function(e) {
    // If the click is NOT inside a custom dropdown...
    if (!e.target.closest('.custom-dropdown')) {
        // ...find all dropdowns and close them
        document.querySelectorAll('.custom-dropdown').forEach(d => {
            d.classList.remove('active');
        });
    }
});

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

    document.querySelectorAll('.custom-dropdown').forEach(d => d.classList.remove('active'));
    
});

// --- UPDATED CUSTOM ALERT FUNCTION ---
function showAlert(message, showPNR = false) {
    document.getElementById('alertMessage').innerText = message;
    
    const pnrContainer = document.getElementById('pnr-container');

    if (showPNR === true) {
        // This only runs if you put ', true' in the button
        pnrContainer.style.display = 'block'; 
    } else {
        // This runs for everything else (errors, etc.)
        pnrContainer.style.display = 'none';
    }
    
    document.getElementById('customAlert').style.display = 'flex';
}

// --- CLOSE ALERT FUNCTION ---
function closeCustomAlert() {
    document.getElementById('customAlert').style.display = 'none';
}

// --- USER STORY 5: SEARCH & BOOK FLIGHT ---

// Function triggered when user clicks "Search" on Home Page
/* =========================================
   1. SEARCH LOGIC (With the FIXED Button)
   ========================================= */
function searchFlights() {
    const originInput = document.getElementById('origin')?.value || "Mumbai"; 
    const destInput = document.getElementById('destination')?.value || "London";
    const dateInput = document.getElementById('travelDate')?.value || "30-01-2026";
    const categoryInput = "Economy"; 

    // Get Data
    const flights = JSON.parse(localStorage.getItem('flightsList')) || [];

    // Filter
    const matchingFlights = flights.filter(f => 
        (f.origin.toLowerCase() === originInput.toLowerCase()) &&
        (f.destination.toLowerCase() === destInput.toLowerCase())
    );

    // Render
    const tbody = document.getElementById('searchResultsBody');
    if(tbody) tbody.innerHTML = ''; 

    const resultsContainer = document.getElementById('searchResultsContainer');
    
    if (matchingFlights.length > 0) {
        if(resultsContainer) resultsContainer.style.display = 'block';

        matchingFlights.forEach(f => {
            const seatCount = f.seats ? f.seats.economy : "N/A";
            const tr = document.createElement('tr');
            tr.style.borderBottom = "1px solid rgba(255,255,255,0.1)";
            
            // ---------------------------------------------------------
            // CRITICAL FIX: Ensure this says 'confirmBooking', NOT 'bookFlight'
            // ---------------------------------------------------------
            tr.innerHTML = `
                <td style="padding: 10px;">${f.flightId}</td>
                <td style="padding: 10px;">${seatCount}</td>
                <td style="padding: 10px;">${categoryInput}</td>
                <td style="padding: 10px;">${dateInput}</td>
                <td style="padding: 10px; text-align: center;">
                    <button onclick="confirmBooking('${f.flightId}', '${f.origin}', '${f.destination}')" 
                            style="background: #4facfe; border: none; padding: 8px 15px; color: white; border-radius: 5px; cursor: pointer; font-weight: bold;">
                        Book
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } else {
        alert("No flights found for this route.");
        if(resultsContainer) resultsContainer.style.display = 'none';
    }
}

// Function triggered when user clicks "Book"


/* --- COPY PROMO CODE FUNCTION --- */
function copyCode(code) {
    navigator.clipboard.writeText(code);
    showAlert("Promo Code " + code + " copied to clipboard!");
}

/* --- BLOCK PAST DATES FOR FLIGHT BOOKING --- */
document.addEventListener('DOMContentLoaded', function() {
    
    const dateInput = document.getElementById('deptDate');
    const dropdown = document.querySelector('.custom-dropdown');
    const trigger = document.querySelector('.dropdown-trigger');
    const options = document.querySelectorAll('.option-item');
    const hiddenInput = document.getElementById('class-input');
    const displayText = document.getElementById('selected-class-text');
    
    if (dateInput) {
        const today = new Date();
        
        // Format today's date as YYYY-MM-DD
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const dd = String(today.getDate()).padStart(2, '0');
        
        const minDate = `${yyyy}-${mm}-${dd}`;
        
        // Set the MINIMUM allowed date to today
        dateInput.setAttribute('min', minDate);
    }

    if (dropdown && trigger) {
        
        // 2. Click Trigger -> Toggle Menu
        trigger.addEventListener('click', function(e) {
            e.stopPropagation(); // Stop click from hitting the window listener
            
            // Toggle the 'active' class
            // This works with the CSS to Show/Hide the menu
            dropdown.classList.toggle('active');
            
            console.log("Dropdown Clicked! Classes are now:", dropdown.className);
        });

        // 3. Click Option -> Select It
        options.forEach(option => {
            option.addEventListener('click', function(e) {
                e.stopPropagation();
                
                // Get text inside the option (e.g., "Economy")
                // We assume the first span has the class name
                const className = this.querySelector('.class-name').innerText;

                // Update Display Text
                if(displayText) displayText.innerText = className;
                
                // Update Hidden Input (for forms)
                if(hiddenInput) hiddenInput.value = className;

                // Close Menu
                dropdown.classList.remove('active');
            });
        });

        // 4. Click Anywhere Else -> Close Menu
        document.addEventListener('click', function(e) {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    } else {
        console.error("ERROR: Could not find .custom-dropdown or .dropdown-trigger in HTML");
    }
    
});

/* =========================================
   PREMIUM WEB CHECK-IN LOGIC
   ========================================= */

let currentSelectedSeat = null;

// STEP 1 -> STEP 2
function goToStep2() {
    const inputPNR = document.getElementById('ci-pnr').value.toUpperCase().trim();
    
    // Check if the entered PNR matches the one we generated
    if(inputPNR === systemPNR || inputPNR === "KPT882") {
        // Success
        document.getElementById('step1-identify').style.display = 'none';
        document.getElementById('step2-seat').style.display = 'block';
        document.getElementById('progress-step-1').classList.remove('active');
        document.getElementById('progress-step-2').classList.add('active');
        renderPremiumSeatMap();
    } else {
        // Error
        alert(`❌ INCORRECT PNR!\n\nPlease use the PNR from your booking confirmation: ${systemPNR}`);
    }
}

// RENDER MAP
function renderPremiumSeatMap() {
    const grid = document.getElementById('seat-map-grid');
    grid.innerHTML = ""; // Clear

    const rows = 8; // Number of rows
    const letters = ['A', 'B', 'C', '', 'D', 'E', 'F']; // Gap is aisle

    for(let r = 1; r <= rows; r++) {
        letters.forEach(letter => {
            if(letter === '') {
                // The Aisle
                const aisle = document.createElement('div');
                aisle.style.width = "20px";
                aisle.innerText = r; // Row number in aisle
                aisle.style.color = "#444";
                aisle.style.fontSize = "10px";
                aisle.style.textAlign = "center";
                aisle.style.lineHeight = "35px";
                grid.appendChild(aisle);
            } else {
                // The Seat
                const btn = document.createElement('button');
                btn.className = 'seat-btn available';
                btn.innerText = letter;
                const seatId = r + letter;

                // Randomly occupy seats
                if(Math.random() < 0.4) {
                    btn.className = 'seat-btn occupied';
                    btn.disabled = true;
                } else {
                    btn.onclick = () => handleSeatClick(btn, seatId);
                }
                grid.appendChild(btn);
            }
        });
    }
}

// HANDLE CLICK
function handleSeatClick(btn, seatId) {
    // Deselect previous
    const prev = document.querySelector('.seat-btn.selected');
    if(prev) prev.classList.remove('selected');

    // Select new
    btn.classList.add('selected');
    currentSelectedSeat = seatId;
    document.getElementById('display-selected-seat').innerText = seatId;
}

// STEP 2 -> STEP 3 (CONFIRM)
function confirmCheckIn() {
    if(!currentSelectedSeat) {
        showAlert("Please select a seat to continue.");
        return;
    }

    // Switch UI
    document.getElementById('step2-seat').style.display = 'none';
    document.getElementById('step3-success').style.display = 'block';

    // Update Stepper
    document.getElementById('progress-step-2').classList.remove('active');
    document.getElementById('progress-step-3').classList.add('active');

    // --- INTEGRATION: Generate the Ticket for Boarding Passes Tab ---
    // (This uses the function we wrote earlier)
    if(typeof generateBoardingPass === "function") {
        // We temporarily mock the inputs needed for that function
        // or we can call the logic directly here to create the ticket
        createTicketCard(currentSelectedSeat); 
    }
}

// Helper to create the ticket (Duplicate of previous logic for safety)
function createTicketCard(seat) {
     const pnr = document.getElementById('ci-pnr').value.toUpperCase();
     const newTicketHTML = `
        <div class="boarding-pass" style="animation: fadeIn 0.5s;">
            <div class="pass-left">
                <div class="airline-name">KAPITT. VIMAAN</div>
                <div class="flight-route"><h1>BOM</h1> <i class='bx bxs-plane' style="color:#4facfe;"></i> <h1>LHR</h1></div>
                <div class="flight-details">
                    <div><span>FLIGHT</span><br>KPT882</div>
                    <div><span>DATE</span><br>TODAY</div>
                    <div><span>GATE</span><br>A4</div>
                </div>
            </div>
            <div class="pass-right">
                <div class="seat-info"><span>SEAT</span><h1>${seat}</h1></div>
                <div class="qr-area"><i class='bx bx-qr-scan' style="font-size: 32px;"></i></div>
                <button class="btn-cancel" onclick="cancelFlight(this)">CANCEL</button>
            </div>
        </div>
    `;
    const list = document.getElementById('confirmed');
    if(list) list.insertAdjacentHTML('afterbegin', newTicketHTML);
}

/* =========================================
   BOOKING LOGIC (Generates the PNR)
   ========================================= */
/* =========================================
   NEW BOOKING LOGIC (Generates & Shows PNR)
   ========================================= */
/* =========================================
   2. BOOKING LOGIC (The New Function)
   ========================================= */


function confirmBooking(flightId, origin, destination) {
    // 1. Debug Message (Press F12 to see this)
    console.log("CONFIRM BOOKING STARTED for flight:", flightId);

    // 2. Generate PNR
    const randomNum = Math.floor(Math.random() * 900) + 100;
    systemPNR = "KV-" + randomNum;
    
    // 3. TARGET THE HTML ELEMENTS
    // We are going to find the elements manually to be safe
    const pnrBox = document.getElementById('pnrDisplay');
    const msgBox = document.getElementById('alertMessage');

    // 4. FORCE UPDATE THE TEXT
    if (pnrBox) {
        pnrBox.innerText = systemPNR; // Change "---" to "KV-xxx"
        pnrBox.style.color = "#4facfe"; 
        console.log("PNR Updated to:", systemPNR);
    } else {
        alert("CRITICAL ERROR: HTML Element 'pnrDisplay' is missing!");
    }

    if (msgBox) {
        msgBox.innerHTML = `Flight <strong>${origin}</strong> ➔ <strong>${destination}</strong> confirmed.`;
    }

    // 5. OPEN THE MODAL
    document.getElementById('customAlert').style.display = 'flex';
}

/* =========================================
   3. FINAL STEP: VIEW BOARDING PASS
   ========================================= */
/* =========================================
   3. FINAL STEP: VIEW BOARDING PASS (Fixed)
   ========================================= */
/* =========================================
   3. FINAL STEP: VIEW BOARDING PASS (Fail-Safe Version)
   ========================================= */
/* =========================================
   3. FINAL STEP: VIEW BOARDING PASS (Fail-Safe Version)
   ========================================= */
/* =========================================
   3. FINAL STEP: VIEW BOARDING PASS (Corrected)
   ========================================= */
/* =========================================
   3. FINAL STEP: VIEW BOARDING PASS (Smart Logic)
   ========================================= */
/* =========================================
   3. FINAL STEP: VIEW BOARDING PASS
   ========================================= */
/* =========================================
   3. FINAL FIX: VIEW BOARDING PASS (Relative Targeting)
   ========================================= */
// Note the 'btn' parameter inside the function brackets
function viewBoardingPasses(btn) {
    
    // --- 1. HIDE THE CURRENT SECTION (Fool-Proof Method) ---
    // This line says: "Find the closest parent div with class 'content-section' and hide it."
    // It works regardless of what ID you used.
    if (btn) {
        const parentSection = btn.closest('.content-section');
        if (parentSection) {
            parentSection.style.display = 'none';
        }
    } else {
        // Fallback if 'this' wasn't passed (just hides the specific ID we know exists)
        const manualCheck = document.getElementById('checkin-section');
        if(manualCheck) manualCheck.style.display = 'none';
    }

    // --- 2. SHOW THE FLIGHT LOGBOOK ---
    const trips = document.getElementById('trips');
    if (trips) {
        trips.style.display = 'block';
    } else {
        alert("CRITICAL ERROR: I cannot find <div id='trips'>. Please check your HTML spelling.");
        return;
    }

    // --- 3. SWITCH TO CONFIRMED TAB ---
    if (typeof filterTrips === "function") {
        filterTrips('confirmed');
    }
}

/* =========================================
   FLIGHT STATUS FEATURE
   ========================================= */

/* --- NEW WORKING CODE --- */
function openFlightStatus() {
    // Target the NEW modal that actually exists in your file
    const modal = document.getElementById('flightStatusModal'); 
    if (modal) {
        modal.style.display = 'flex';
    } else {
        console.error("Error: Could not find 'flightStatusModal'");
    }
}

// 2. Close the Modal
function closeStatusModal() {
    document.getElementById('flightStatusModal').style.display = 'none';
}

// 3. The Logic (Simulate a Real Check)
function checkFlightStatus() {
    const flightNum = document.getElementById('status-flight-num').value.toUpperCase();
    const resultBox = document.getElementById('status-result');
    const statusText = document.getElementById('status-text');
    const statusRoute = document.getElementById('status-route');
    const statusTime = document.getElementById('status-time');

    // Validation
    if(flightNum.length < 3) {
        alert("Please enter a valid Flight Number (e.g., KPT882)");
        return;
    }

    // --- SIMULATION LOGIC ---
    
    // Randomly decide the status to make it look real
    // 70% chance of "On Time", 20% "Delayed", 10% "Boarding"
    const random = Math.random(); 
    
    let status = "ON TIME";
    let color = "#4facfe"; // Blue
    let icon = "✈️";

    if (random > 0.7 && random < 0.9) {
        status = "DELAYED";
        color = "#ff4d4d"; // Red
        icon = "⚠️";
    } else if (random >= 0.9) {
        status = "BOARDING";
        color = "#00ff88"; // Green
        icon = "🔔";
    }

    // Update the UI
    resultBox.style.display = 'block';
    resultBox.style.border = `1px solid ${color}`;
    
    statusText.innerHTML = `${icon} ${status}`;
    statusText.style.color = color;
    
    // Make up a fake route based on the number
    statusRoute.innerText = `Flight ${flightNum}`;
    
    if(status === "DELAYED") {
        statusTime.innerText = "New Time: +45 Mins";
    } else if (status === "BOARDING") {
        statusTime.innerText = "Gate B4 - Closing Soon";
    } else {
        statusTime.innerText = "Scheduled Arrival";
    }
}

function openTrackFlight() {
    const modal = document.getElementById('flightStatusModal');
    if (modal) {
        modal.style.display = 'flex'; // Opens the box
    }
}

/* =========================================
   FIX: CLOSE TRACK FLIGHT MODAL
   ========================================= */
function closeTrackFlight() {
    // We target the specific ID for the Track Flight overlay
    const modal = document.getElementById('flightStatusModal');
    if (modal) {
        modal.style.display = 'none';
    } else {
        console.error("Error: Could not find id='flightStatusModal'");
    }
}