// --- ADMIN TAB NAVIGATION LOGIC ---
function showAdminSection(sectionId) {
    // 1. Hide all sections
    document.querySelectorAll('.admin-tab-content').forEach(div => {
        div.style.display = 'none';
    });

    // 2. Remove active class from buttons
    document.getElementById('btnCarrier').classList.remove('active-btn');
    document.getElementById('btnFlight').classList.remove('active-btn');

    // 3. Show the selected section
    document.getElementById(sectionId).style.display = 'block';

    // 4. Highlight the button
    if (sectionId === 'carrierSection') {
        document.getElementById('btnCarrier').classList.add('active-btn');
    } else {
        document.getElementById('btnFlight').classList.add('active-btn');
    }
}
// Function to handle "Add Carrier" User Story
function registerCarrier() {
    
    // 1. Get Values strictly from the IDs we created
    const carrierData = {
        carrierName: document.getElementById('carrierName').value,
        
        // Discount Percentages
        disc30: document.getElementById('disc30').value,
        disc60: document.getElementById('disc60').value,
        disc90: document.getElementById('disc90').value,
        discBulk: document.getElementById('discBulk').value,
        discSilver: document.getElementById('discSilver').value,
        discGold: document.getElementById('discGold').value,
        discPlatinum: document.getElementById('discPlatinum').value,

        // Refund Percentages
        ref2Days: document.getElementById('ref2Days').value,
        ref10Days: document.getElementById('ref10Days').value,
        ref20Days: document.getElementById('ref20Days').value
    };

    // 2. (Optional) Save to LocalStorage to simulate Database
    // This helps in the next User Story (Edit/Delete)
    let carriers = JSON.parse(localStorage.getItem('carriersList')) || [];
    carriers.push(carrierData);
    localStorage.setItem('carriersList', JSON.stringify(carriers));

    // 3. Show Success Message (Required by User Story)
    const successMsg = document.getElementById('successMessage');
    successMsg.style.display = 'block';

    // 4. Clear Form
    document.getElementById('addCarrierForm').reset();

    // Hide success message after 3 seconds
    setTimeout(() => {
        successMsg.style.display = 'none';
    }, 3000);
}

// --- NEW CODE FOR USER STORY 2 (EDIT/DELETE) ---

// 1. ON LOAD: Populate the Select Dropdown with existing carriers
document.addEventListener('DOMContentLoaded', function() {
    loadCarrierDropdown();
    loadFlightCarrierDropdown();
    loadFlightSearchDropdown();
});

function loadCarrierDropdown() {
    const carrierSelect = document.getElementById('carrierSelect');
    // Clear existing options except the first one
    carrierSelect.innerHTML = '<option value="">Select Carrier</option>';
    
    // Get list from LocalStorage
    const carriers = JSON.parse(localStorage.getItem('carriersList')) || [];
    
    carriers.forEach(carrier => {
        const option = document.createElement('option');
        option.value = carrier.carrierName;
        option.textContent = carrier.carrierName;
        carrierSelect.appendChild(option);
    });
}

// 2. SEARCH FUNCTION
function searchCarrier() {
    const selectedName = document.getElementById('carrierSelect').value;
    const carriers = JSON.parse(localStorage.getItem('carriersList')) || [];
    
    // Find the carrier object
    const carrier = carriers.find(c => c.carrierName === selectedName);

    if (carrier) {
        // Show the form
        document.getElementById('editFormContainer').style.display = 'block';

        // Requirement: CarrierName Text Box Not Editable
        document.getElementById('edit_carrierName').value = carrier.carrierName;

        // Requirement: Populate Number Fields with old Value
        document.getElementById('edit_disc60').value = carrier.disc60 || 0;
        document.getElementById('edit_disc90').value = carrier.disc90 || 0;
        document.getElementById('edit_discBulk').value = carrier.discBulk || 0;
        document.getElementById('edit_discSilver').value = carrier.discSilver || 0;
        document.getElementById('edit_discGold').value = carrier.discGold || 0;
        document.getElementById('edit_discPlatinum').value = carrier.discPlatinum || 0;

        document.getElementById('edit_ref2Days').value = carrier.ref2Days || 0;
        document.getElementById('edit_ref10Days').value = carrier.ref10Days || 0;
        document.getElementById('edit_ref20Days').value = carrier.ref20Days || 0;

        // Clear any previous messages
        document.getElementById('editMessage').style.display = 'none';
    } else {
        alert("Please select a valid carrier first.");
    }
}

// 3. EDIT CARRIER FUNCTION
function updateCarrier() {
    const carrierName = document.getElementById('edit_carrierName').value;
    let carriers = JSON.parse(localStorage.getItem('carriersList')) || [];
    
    // Find index
    const index = carriers.findIndex(c => c.carrierName === carrierName);

    if (index !== -1) {
        // Update details
        carriers[index].disc60 = document.getElementById('edit_disc60').value;
        carriers[index].disc90 = document.getElementById('edit_disc90').value;
        carriers[index].discBulk = document.getElementById('edit_discBulk').value;
        carriers[index].discSilver = document.getElementById('edit_discSilver').value;
        carriers[index].discGold = document.getElementById('edit_discGold').value;
        carriers[index].discPlatinum = document.getElementById('edit_discPlatinum').value;
        
        carriers[index].ref2Days = document.getElementById('edit_ref2Days').value;
        carriers[index].ref10Days = document.getElementById('edit_ref10Days').value;
        carriers[index].ref20Days = document.getElementById('edit_ref20Days').value;

        // Save back to storage
        localStorage.setItem('carriersList', JSON.stringify(carriers));

        // Requirement: Show message "<CarrierName> details are updated Successfully"
        const msgBox = document.getElementById('editMessage');
        msgBox.style.display = 'block';
        msgBox.style.color = '#43e97b'; // Green
        msgBox.textContent = `${carrierName} details are updated Successfully`;
    }
}

// 4. DELETE CARRIER FUNCTION
function deleteCarrier() {
    const carrierName = document.getElementById('edit_carrierName').value;
    
    if(!confirm(`Are you sure you want to delete ${carrierName}?`)) return;

    let carriers = JSON.parse(localStorage.getItem('carriersList')) || [];
    
    // Filter out the deleted carrier
    const newCarriers = carriers.filter(c => c.carrierName !== carrierName);
    
    // Save new list
    localStorage.setItem('carriersList', JSON.stringify(newCarriers));

    // Requirement: Show message "Carrier Detail is removed from the System"
    const msgBox = document.getElementById('editMessage');
    msgBox.style.display = 'block';
    msgBox.style.color = '#ff9a9e'; // Reddish
    msgBox.textContent = "Carrier Detail is removed from the System";

    // Hide the form after a delay and refresh dropdown
    setTimeout(() => {
        document.getElementById('editFormContainer').style.display = 'none';
        document.getElementById('editMessage').style.display = 'none';
        document.getElementById('carrierSelect').value = ""; // Reset dropdown
        loadCarrierDropdown(); // Refresh the dropdown list
    }, 2000);
}

function loadFlightCarrierDropdown() {
    const flightSelect = document.getElementById('flightCarrierSelect');
    if(!flightSelect) return; // Safety check

    flightSelect.innerHTML = '<option value="">Select Carrier</option>';
    const carriers = JSON.parse(localStorage.getItem('carriersList')) || [];
    
    carriers.forEach(carrier => {
        const option = document.createElement('option');
        option.value = carrier.carrierName;
        option.textContent = carrier.carrierName;
        flightSelect.appendChild(option);
    });
}

function addFlight() {
    // 1. Get Values
    const carrier = document.getElementById('flightCarrierSelect').value;
    const origin = document.getElementById('flightOrigin').value;
    const destination = document.getElementById('flightDestination').value;
    const fare = document.getElementById('airFare').value;
    const seatBus = document.getElementById('seatBusiness').value;
    const seatEco = document.getElementById('seatEconomy').value;
    const seatExec = document.getElementById('seatExecutive').value;

    // Basic Validation
    if(origin === destination) {
        alert("Origin and Destination cannot be the same!");
        return;
    }

    // 2. Generate Static ID (Requirement: "Flight Id generated is <Static ID>")
    // We will generate a random one to look real, e.g., "FL-101"
    const flightId = "FL-" + Math.floor(1000 + Math.random() * 9000);

    // 3. Create Object
    const flightData = {
        flightId: flightId,
        carrier: carrier,
        origin: origin,
        destination: destination,
        fare: fare,
        seats: {
            business: seatBus,
            economy: seatEco,
            executive: seatExec
        }
    };

    // 4. Save to LocalStorage
    let flights = JSON.parse(localStorage.getItem('flightsList')) || [];
    flights.push(flightData);
    localStorage.setItem('flightsList', JSON.stringify(flights));

    // 5. Show Exact Success Message
    const msgBox = document.getElementById('flightSuccessMessage');
    msgBox.style.display = 'block';
    // STRICT TEXT REQUIREMENT:
    msgBox.textContent = `Flight Information Saved Successfully!!! - Flight Id generated is ${flightId}`;

    // Clear form
    document.getElementById('addFlightForm').reset();

    // Hide message after 4 seconds
    setTimeout(() => {
        msgBox.style.display = 'none';
    }, 4000);
}

function loadFlightSearchDropdown() {
    const searchSelect = document.getElementById('search_flightCarrier');
    if(!searchSelect) return;
    
    searchSelect.innerHTML = '<option value="">Select Carrier</option>';
    const carriers = JSON.parse(localStorage.getItem('carriersList')) || [];
    
    carriers.forEach(carrier => {
        const option = document.createElement('option');
        option.value = carrier.carrierName;
        option.textContent = carrier.carrierName;
        searchSelect.appendChild(option);
    });
}

function searchFlightsForEdit() {
    const carrier = document.getElementById('search_flightCarrier').value;
    const origin = document.getElementById('search_flightOrigin').value;
    const dest = document.getElementById('search_flightDest').value;

    const flights = JSON.parse(localStorage.getItem('flightsList')) || [];

    // Filter Logic
    const matchingFlights = flights.filter(f => 
        (carrier === "" || f.carrier === carrier) &&
        (origin === "" || f.origin === origin) &&
        (dest === "" || f.destination === dest)
    );

    const tbody = document.getElementById('flightTableBody');
    tbody.innerHTML = ''; // Clear old results

    if (matchingFlights.length > 0) {
        document.getElementById('flightResultsArea').style.display = 'block';
        
        matchingFlights.forEach(f => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="padding:10px; border-bottom:1px solid #555;">${f.flightId}</td>
                <td style="padding:10px; border-bottom:1px solid #555;">${f.carrier}</td>
                <td style="padding:10px; border-bottom:1px solid #555;">${f.origin}</td>
                <td style="padding:10px; border-bottom:1px solid #555;">${f.destination}</td>
                <td style="padding:10px; border-bottom:1px solid #555;">
                    <button onclick="selectFlight('${f.flightId}')" style="cursor:pointer; background:#fff; color:#000; border:none; padding:5px 10px; border-radius:3px;">Select</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } else {
        alert("No flights found matching criteria.");
        document.getElementById('flightResultsArea').style.display = 'none';
    }
}

let currentFlightId = null; // Store ID to know which one we are editing

function selectFlight(flightId) {
    const flights = JSON.parse(localStorage.getItem('flightsList')) || [];
    const flight = flights.find(f => f.flightId === flightId);

    if (flight) {
        currentFlightId = flightId;
        document.getElementById('flightEditFormContainer').style.display = 'block';

        // Requirement: Carrier - Not Editable
        document.getElementById('update_carrier').value = flight.carrier;
        
        // Requirement: Origin/Dest - Text Box (Editable)
        document.getElementById('update_origin').value = flight.origin;
        document.getElementById('update_dest').value = flight.destination;

        // Requirement: Numeric Fields
        document.getElementById('update_fare').value = flight.fare;
        document.getElementById('update_seatBus').value = flight.seats.business;
        document.getElementById('update_seatEco').value = flight.seats.economy;
        document.getElementById('update_seatExec').value = flight.seats.executive;

        // Hide message
        document.getElementById('flightUpdateMsg').style.display = 'none';
        
        // Scroll to form
        document.getElementById('flightEditFormContainer').scrollIntoView({behavior: "smooth"});
    }
}

// 4. EDIT FLIGHT BUTTON
function saveFlightUpdates() {
    if(!currentFlightId) return;

    let flights = JSON.parse(localStorage.getItem('flightsList')) || [];
    const index = flights.findIndex(f => f.flightId === currentFlightId);

    if (index !== -1) {
        // Update values
        flights[index].origin = document.getElementById('update_origin').value;
        flights[index].destination = document.getElementById('update_dest').value;
        flights[index].fare = document.getElementById('update_fare').value;
        flights[index].seats.business = document.getElementById('update_seatBus').value;
        flights[index].seats.economy = document.getElementById('update_seatEco').value;
        flights[index].seats.executive = document.getElementById('update_seatExec').value;

        localStorage.setItem('flightsList', JSON.stringify(flights));

        // Requirement: Success Message "Flight Information Updated Successfully!!!"
        const msg = document.getElementById('flightUpdateMsg');
        msg.style.display = 'block';
        msg.style.color = '#43e97b';
        msg.textContent = "Flight Information Updated Successfully!!!";
    }
}

// 5. DELETE FLIGHT BUTTON
function removeFlight() {
    if(!currentFlightId) return;

    if(!confirm("Are you sure you want to delete this flight?")) return;

    let flights = JSON.parse(localStorage.getItem('flightsList')) || [];
    const newFlights = flights.filter(f => f.flightId !== currentFlightId);

    localStorage.setItem('flightsList', JSON.stringify(newFlights));

    // Requirement: Success Message "Flight details are removed Successfully!!!"
    const msg = document.getElementById('flightUpdateMsg');
    msg.style.display = 'block';
    msg.style.color = '#ff9a9e';
    msg.textContent = "Flight details are removed Successfully!!!";

    // Refresh table and hide form after delay
    setTimeout(() => {
        document.getElementById('flightEditFormContainer').style.display = 'none';
        document.getElementById('flightResultsArea').style.display = 'none';
        searchFlightsForEdit(); // Refresh the list if they want to search again
    }, 2000);
}

// --- SUB-TAB SWITCHING LOGIC (Add vs Edit) ---
function switchMode(section, mode) {
    // section = 'carrier' or 'flight'
    // mode = 'add' or 'edit'

    // 1. Get Wrappers
    const addWrapper = document.getElementById(`${section}AddWrapper`);
    const editWrapper = document.getElementById(`${section}EditWrapper`);
    
    // 2. Get Buttons
    const btnAdd = document.getElementById(`btn${capitalize(section)}Add`);
    const btnEdit = document.getElementById(`btn${capitalize(section)}Edit`);

    // 3. Toggle Logic
    if (mode === 'add') {
        addWrapper.style.display = 'block';
        editWrapper.style.display = 'none';
        
        btnAdd.classList.add('active-mode');
        btnEdit.classList.remove('active-mode');
    } else {
        addWrapper.style.display = 'none';
        editWrapper.style.display = 'block';
        
        btnAdd.classList.remove('active-mode');
        btnEdit.classList.add('active-mode');
    }
}

// Helper to capitalize first letter (e.g., 'carrier' -> 'Carrier')
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}