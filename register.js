/* --- REGISTRATION LOGIC (Consolidated & Fixed) --- */

function validateAndRegister() {
    // 1. Get Values
    const fname = document.getElementById('fname').value.trim();
    const lname = document.getElementById('lname').value.trim();
    const dob = document.getElementById('dob').value;
    const contact = document.getElementById('contact').value.trim();
    const email = document.getElementById('email').value.trim();
    const address = document.getElementById('address').value.trim();
    const password = document.getElementById('pass').value.trim();

    // 2. CHECK EMPTY FIELDS
    if (!fname || !lname || !dob || !contact || !email || !address || !password) {
        alert("ERROR: Please fill in all fields.");
        return;
    }

    // --- VALIDATION RULES ---

    // A. NAME (Alphabets Only, No Junk)
    const nameRegex = /^[A-Za-z]+$/;
    const junkWords = ['test', 'demo', 'admin', 'user', 'abcd', 'xyz', 'qwer', 'asdf', 'null', 'none', 'fart', 'stupid'];

    if (!nameRegex.test(fname) || !nameRegex.test(lname)) {
        alert("ERROR: Names must contain alphabets only.");
        return;
    }
    if (junkWords.includes(fname.toLowerCase()) || junkWords.includes(lname.toLowerCase())) {
        alert("ERROR: Please enter a real name.");
        return;
    }
    // Block repeating characters (e.g., "tttt")
    if (/(.)\1\1/.test(fname) || /(.)\1\1/.test(lname)) {
        alert("ERROR: Name looks fake (repeating characters).");
        return;
    }

    // B. DATE OF BIRTH (> 1924, 18+ Age, No Future)
    const birthDate = new Date(dob);
    const today = new Date();
    const minDate = new Date('1924-01-01');
    today.setHours(0,0,0,0);

    if (isNaN(birthDate.getTime())) {
        alert("ERROR: Invalid Date."); return;
    }
    if (birthDate <= minDate) {
        alert("ERROR: Date must be after 01-01-1924."); return;
    }
    if (birthDate > today) {
        alert("ERROR: Date cannot be in the future."); return;
    }
    
    // Age Calculation
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    if (age < 18) {
        alert("ERROR: You must be at least 18 years old to register.");
        return;
    }

    // C. CONTACT (10 Digits, Starts with 6-9)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(contact)) {
        alert("ERROR: Invalid Mobile Number (Must be 10 digits & start with 6-9).");
        return;
    }
    if (/(.)\1{5,}/.test(contact)) {
        alert("ERROR: Invalid Mobile Number (Too many repeating digits).");
        return;
    }

    // D. EMAIL (Standard Format)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        alert("ERROR: Invalid Email ID.");
        return;
    }

    // E. PASSWORD (Min 6, Max 30, Strong)
    // 1. Length Check
    if (password.length < 6) {
        alert("ERROR: Password must be at least 6 characters long.");
        return;
    }
    if (password.length > 30) {
        alert("ERROR: Password must be less than 30 characters.");
        return;
    }
    // 2. Complexity Check (Uppercase, Symbol, No Spaces)
    const passRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?!.*\s).{6,30}$/;
    if (!passRegex.test(password)) {
        alert("ERROR: Weak Password!\n\nRules:\n- Min 6 chars, Max 30 chars\n- At least 1 Uppercase (A-Z)\n- At least 1 Symbol (!@#$)\n- No Spaces");
        return;
    }

    // --- SUCCESS: GENERATE ID & SAVE ---
    const passengerID = Math.floor(10000 + Math.random() * 90000); // 5-digit ID

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

    // Save to Browser Storage
    localStorage.setItem('registeredUser', JSON.stringify(userData));

    // UI UPDATE: Hide Form, Show Success
    document.getElementById('regForm').style.display = "none";
    document.getElementById('successMessage').style.display = "block";

    // Show Details in Success Box
    document.getElementById('genDetails').innerHTML = `
        Passenger ID: <strong>${passengerID}</strong><br>
        Password: <strong>${password}</strong>
    `;
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
