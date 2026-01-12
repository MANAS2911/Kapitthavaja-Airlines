function validateAndRegister() {

    // 1. Get Values

    const fname = document.getElementById('fname').value.trim();
    const lname = document.getElementById('lname').value.trim();
    const dob = document.getElementById('dob').value;
    const contact = document.getElementById('contact').value.trim();
    const email = document.getElementById('email').value.trim();
    const address = document.getElementById('address').value.trim();
    const password = document.getElementById('pass').value.trim();

    const allowedDomains = [
        'gmail.com',
        'yahoo.com',
        'outlook.com',
        'hotmail.com',
        'icloud.com',
        'tcs.com',
        'rediffmail.com'
    ];



    // 2. CHECK EMPTY FIELDS

    if (!fname || !lname || !dob || !contact || !email || !address || !password) {
        showAlert("ERROR: Please fill in all fields.");
        return;
    }
    // --- VALIDATION RULES ---
    // A. NAME (Alphabets Only, No Junk)

    const nameRegex = /^[A-Za-z]+$/;

    const junkWords = ['test', 'demo', 'admin', 'user', 'abcd', 'xyz', 'qwer', 'asdf', 'null', 'none', 'fart', 'stupid'];

    const alphabet = "abcdefghijklmnopqrstuvwxyz"


    if (fname.length < 3) {
        showAlert("ERROR: First Name must be at least 3 characters long.");
        return;
    }

    if (alphabet.includes(fname.toLowerCase())) {
        showAlert("Error: First Name cannot be a simple alphabetical sequence (like 'abc').");
        return;
    }
    if (!nameRegex.test(fname)) {
        showAlert("ERROR: First name must contain alphabets only (no numbers or symbols).");
        return;
    }
    if (junkWords.includes(fname.toLowerCase())) {
        showAlert("ERROR: Please enter a real first name.");
        return;
    }
    if (/(.)\1\1/.test(fname)) {
        showAlert("ERROR: First Name looks fake (repeating characters).");
        return;
    }

    const consonantSmash = /[bcdfghjklmnpqrstvwxyz]{5,}/i;
    if (consonantSmash.test(fname)) {
        showAlert("Error: First Name looks unpronounceable (too many consonants).");
        return;
    }

    if (lname.length < 3) {
        showAlert("ERROR: Last Name must be at least 3 characters long.");
        return;
    }

    if (alphabet.includes(lname.toLowerCase())) {
        showAlert("Error: Last Name cannot be a simple alphabetical sequence (like 'def').");
        return;
    }

    if (!nameRegex.test(lname)) {
        showAlert("ERROR: Last name must contain alphabets only (no numbers or symbols).");
        return;
    }

    if (junkWords.includes(lname.toLowerCase())) {
        showAlert("ERROR: Please enter a real last name.");
        return;
    }

    // Block repeating characters (e.g., "tttt")

    if (/(.)\1\1/.test(lname)) {
        showAlert("ERROR: Last Name looks fake (repeating characters).");
        return;
    }

    if (consonantSmash.test(lname)) {
        showAlert("Error: Last Name looks unpronounceable (too many consonants).");
        return;
    }



    if (fname.toLowerCase() === lname.toLowerCase()) {
        showAlert("Error: First Name and Last Name cannot be the same.");
        return;
    }

    // B. DATE OF BIRTH (> 1924, 18+ Age, No Future)

    const birthDate = new Date(dob);
    const today = new Date();
    const minDate = new Date('1924-01-01');
    today.setHours(0,0,0,0);

    if (isNaN(birthDate.getTime())) {
        showAlert("ERROR: Invalid Date.");
        return;
    }

    if (birthDate <= minDate) {
        showAlert("ERROR: DOB must be after 01-01-1924.");
        return;
    }

    if (birthDate > today) {
        showAlert("ERROR: DOB cannot be in the future.");
        return;
    }

    

    // Age Calculation

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    if (age < 18) {
        showAlert("ERROR: You must be at least 18 years old to register.");
        return;
    }

    // C. CONTACT (10 Digits, Starts with 6-9)

    const phoneRegex = /^[6-9]\d{9}$/;

    if (!phoneRegex.test(contact)) {
        showAlert("ERROR: Invalid Mobile Number (Must be 10 digits & start with 6-9).");
        return;
    }

    if (/(.)\1{5,}/.test(contact)) {
        showAlert("ERROR: Invalid Mobile Number (Too many repeating digits).");
        return;
    }

    // D. EMAIL (Standard Format)

    if(!email.includes('@')) {
        showAlert("Error: Email is missing '@'.");
        return;
    }

    const parts = email.split('@');
    const userPart = parts[0];
    const domainPart = parts[1].toLowerCase();
    
    if (userPart.length === 0) {
        showAlert("Error: Please provide a username before the '@'.");
        return;
    }

    if (!/^[a-zA-Z0-9._%-]+$/.test(userPart)){
        showAlert("Error: Username contains invalid characters (only letters, numbers, ., _, - allowed).");
        return;
    }

    if (/^\d+$/.test(userPart)) {
        showAlert("Error: Email username cannot be numbers only.");
        return;
    }

    if (userPart.startsWith('.') || userPart.endsWith('.') || userPart.includes('..')) {
        showAlert("Error: Username cannot start/end with a dot or contain consecutive dots.");
        return;
    }

    if (domainPart.length === 0) {
        showAlert("Error: Domain name is missing after '@'.");
        return;
    }

    if(!domainPart.includes('.')) {
        showAlert("Error: Domain is missing a dot (e.g., '.com').");
        return;
    }

    if(domainPart.includes('..') || domainPart.startsWith('-') || domainPart.endsWith('-')) {
        showAlert("Error: Domain has invalid format (double dots or leading/trailing hyphens).");
        return;
    }

    const domainSplit = domainPart.split('.');
    const extension = domainSplit[domainSplit.length - 1];

    if (extension.length < 2) {
        showAlert("Error: Domain extension is too short (must be at least 2 characters, e.g., '.com', '.in').");
        return;
    }

    if (!allowedDomains.includes(domainPart)) {
        showAlert("Error: Domain '" + domainPart + "' is not supported. Please use valid domains like: gmail.com, yahoo.com, hotmail.com, tcs.com etc.");
        return;
    }

    // E. ADDRESS
    const addressWords = address.split(' ').filter(word=> word.length > 0);

    if (address.length < 15) {
    showAlert("Error: Address is too short. Please provide full details (Flat, Building, Street, City).");
    return;
    }

    const hasRealWord = addressWords.some(word => word.length > 2);
    if (!hasRealWord) {
    showAlert("Error: Address seems invalid. Please use real words (e.g., 'Street', 'Road', 'Mumbai').");
    return;
   }

    if (addressWords.length < 3) {
        showAlert("Error: Address is too vague. Please include House No, Street, and City.");
        return;
    }

    for (let word of addressWords) {
        if (/(.)\1\1/.test(word)) {
            showAlert("Error: Address contains gibberish words ("+ word + ").");
            return;
        }
    }

    // F. PASSWORD (Min 6, Max 30, Strong)
    // 1. Length Check

    if (password.length < 6) {
        showAlert("ERROR: Password must be at least 6 characters long.");
        return;
    }

    if (password.length > 30) {
        showAlert("ERROR: Password must be less than 30 characters.");
        return;
    }

    // 2. Complexity Check (Uppercase, Symbol, No Spaces)

    const passRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?!.*\s).{6,30}$/;
    if (!passRegex.test(password)) {
        showAlert("ERROR: Weak Password!\n\nRules:\n-Min 6 chars, Max 30 chars\n- At least 1 Uppercase (A-Z)\n- At least 1 Symbol (!@#$)\n- No Spaces");
        return;
    }

    // --- SUCCESS: GENERATE ID & SAVE ---

// 5-digit ID

const passengerID = Math.floor(10000 + Math.random() * 90000); 

    // 2. Create Data Object
    const userData = {
        firstName: fname,
        lastName: lname,
        dob: dob,
        contact: contact,
        email: email,
        address: address,
        password: password,
        passengerId: passengerID
    };

    // 3. Save to Storage
    localStorage.setItem('registeredUser', JSON.stringify(userData));

    // --- START: Save Temp Credentials for Grace Period ---
    const tempSuccessData = {
        uid: passengerID,       // We use 'passengerID' because that is your variable name
        pass: password,         // The password variable
        timestamp: Date.now()   // The exact time registration happened
    };

    localStorage.setItem('tempSuccessData', JSON.stringify(tempSuccessData));

    // 4. Update UI (Hide Form, Show Success)
    // MAKE SURE 'regForm' MATCHES YOUR HTML ID. If your HTML uses 'registerFormSection', change it here!
    const formSection = document.getElementById('regForm') || document.getElementById('registerFormSection');
    const successSection = document.getElementById('successMessage');

    if (formSection) formSection.style.display = "none";
    if (successSection) successSection.style.display = "block";

    // 5. Fill the Success Box
    // We use 'passengerID' here because that is the name we defined in Step 1
    document.getElementById('showUserId').innerText = passengerID; 
    document.getElementById('finalPassword').value = password; 
}

/* --- RESET FORM --- */

function confirmReset() {
    if (confirm("Are you sure you want to clear the form?")) {
        document.getElementById('regForm').reset();
    }
}

/* --- FORCE LOGOUT AND GO TO LOGIN --- */

function goToLogin() {
    localStorage.removeItem('currentUser');
    window.location.replace("login.html");
}

function togglePassword(inputId, iconId) {
    const inputField = document.getElementById(inputId);
    const icon = document.getElementById(iconId);

    if (inputField.type === "password") {
        // Switch to Text (Show)
        inputField.type = "text";
        
        // Change Icon to Open Eye
        icon.classList.remove('bx-hide');
        icon.classList.add('bx-show');
    } else {
        // Switch back to Password (Hide)
        inputField.type = "password";
        
        // Change Icon to Closed Eye
        icon.classList.remove('bx-show');
        icon.classList.add('bx-hide');
    }
}

// PASTE IT HERE (Outside registerUser)
function togglePassword(inputId, iconId) {
    const inputField = document.getElementById(inputId);
    const icon = document.getElementById(iconId);

    if (inputField.type === "password") {
        inputField.type = "text";
        icon.classList.remove('bx-hide');
        icon.classList.add('bx-show');
    } else {
        inputField.type = "password";
        icon.classList.remove('bx-show');
        icon.classList.add('bx-hide');
    }
}

// --- SAFELY CHECK GRACE PERIOD (Works with existing window.onload) ---
// --- SAFELY CHECK GRACE PERIOD (Matches your HTML IDs) ---
window.addEventListener('load', function() {
    
    // 1. Target the IDs based on your HTML
    const successDiv = document.getElementById('successMessage'); // Your ID is 'successMessage'
    
    // IMPORTANT: Make sure this ID matches your Form's container ID
    // If your form is inside a div with class "container", give it an ID like id="registerContainer"
    const registerForm = document.querySelector('.container') || document.getElementById('registerForm'); 

    // Safety: Only run if we are on the Registration page
    if (!successDiv) return; 

    // 2. Check LocalStorage
    const storedTemp = localStorage.getItem('tempSuccessData');
    
    if (storedTemp) {
        const data = JSON.parse(storedTemp);
        const timeElapsed = Date.now() - data.timestamp;
        const timeLimit = 15000; // 15 Seconds

        if (timeElapsed < timeLimit) {
            console.log("Restoring Session! Seconds left: " + ((timeLimit - timeElapsed)/1000));
            
            // 3. HIDE FORM & SHOW SUCCESS
            if (registerForm) registerForm.style.display = 'none';
            successDiv.style.display = 'block'; // This opens your specific 'successMessage' div

            // 4. RESTORE DATA
            if(document.getElementById('showUserId')) {
                document.getElementById('showUserId').innerText = data.uid;
            }
            if(document.getElementById('finalPassword')) {
                document.getElementById('finalPassword').value = data.pass;
            }

            // 5. START SELF-DESTRUCT TIMER
            setTimeout(() => {
                localStorage.removeItem('tempSuccessData');
                window.location.reload(); 
            }, (timeLimit - timeElapsed));

        } else {
            console.log("Time Expired. Clearing storage.");
            localStorage.removeItem('tempSuccessData');
        }
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