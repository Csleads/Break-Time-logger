// Time zone for Georgia (Tbilisi)
const TIMEZONE = 'Asia/Tbilisi';

// Time slots with 4 slots per half-hour
const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", 
    "12:00", "13:00", "14:00", "15:00", 
    "17:00", "18:00", "19:00", "20:00", "21:00",
    "22:00", "23:00", "00:00", "01:00", "02:00", 
    "03:00", "04:00", "05:00", "06:00", "07:00"
];

// Initialize or retrieve agentSlots from localStorage
let agentSlots = JSON.parse(localStorage.getItem('agentSlots')) || {};

// Function to display current Tbilisi date and time
function displayCurrentTime() {
    const now = new Date().toLocaleString("en-US", { timeZone: TIMEZONE });
    const tbilisiDate = new Date(now).toLocaleDateString("en-GB", { day: '2-digit', month: '2-digit', year: 'numeric' });
    const tbilisiTime = new Date(now).toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    document.getElementById('currentTime').textContent = `Current Tbilisi Date: ${tbilisiDate}, Time: ${tbilisiTime}`;
}

// Update time every second
setInterval(displayCurrentTime, 1000);

// Function to create time slots in the table
function createTimeSlots() {
    const tableBody = document.getElementById('tableBody');

    timeSlots.forEach((slot) => {
        const row = document.createElement('tr');
        const timeCell = document.createElement('td');
        timeCell.textContent = slot;
        row.appendChild(timeCell);

        for (let i = 1; i <= 4; i++) {  // Change to 4 agents
            const cell = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'text';
            input.value = agentSlots[slot] && agentSlots[slot][i - 1] ? agentSlots[slot][i - 1] : '';
            input.placeholder = 'Enter Name';

            if (input.value) {
                input.classList.add('occupied');  // Indicate slot is occupied
                input.readOnly = true;  // Make it read-only
            }

            // Handle input change
            input.onchange = function () {
                updateSlot(slot, input.value, i);
                input.classList.add('occupied');  // Mark as occupied
                input.readOnly = true;  // Make it read-only after entering the name
                startAutoClear();  // Restart the auto-clear timer after input change
            };

            // Allow specific slot clearing in edit mode
            cell.addEventListener('click', () => {
                if (isEditMode && input.value !== '') {
                    clearSlot(slot, i);  // Clear the specific slot when clicked
                    startAutoClear();  // Restart the auto-clear timer after clearing the slot
                }
            });

            cell.appendChild(input);
            row.appendChild(cell);
        }

        tableBody.appendChild(row);
    });
}

// Function to update a specific slot and save it to localStorage
function updateSlot(slot, agentName, slotNumber) {
    if (!agentSlots[slot]) {
        agentSlots[slot] = [];
    }
    agentSlots[slot][slotNumber - 1] = agentName;  // Update the specific slot
    localStorage.setItem('agentSlots', JSON.stringify(agentSlots));  // Save to localStorage
}

// Function to clear a specific slot
function clearSlot(timeSlot, agentNumber) {
    if (agentSlots[timeSlot]) {
        agentSlots[timeSlot][agentNumber - 1] = '';  // Clear the specific slot
        localStorage.setItem('agentSlots', JSON.stringify(agentSlots));  // Update localStorage
        location.reload();  // Reload to reflect changes
    }
}

// Function to automatically clear all slots at 8 AM and 8 PM Georgian time
function startAutoClear() {
    const now = new Date().toLocaleString("en-US", { timeZone: TIMEZONE });
    const currentDateTime = new Date(now);

    // Calculate time until the next clearing (either 8 AM or 8 PM)
    let nextClearTime = new Date(currentDateTime);
    const currentHour = currentDateTime.getHours();

    if (currentHour < 8) {
        nextClearTime.setHours(8, 0, 0, 0);  // Next clear at 8 AM
    } else if (currentHour >= 8 && currentHour < 20) {
        nextClearTime.setHours(20, 0, 0, 0);  // Next clear at 8 PM
    } else {
        nextClearTime.setHours(32, 0, 0, 0);  // Next clear at 8 AM (next day)
    }

    const timeUntilNextClear = nextClearTime - currentDateTime;

    console.log(`Next auto-clear scheduled in ${Math.round(timeUntilNextClear / 3600000)} hours.`);
    
    setTimeout(() => {
        resetAllSlots();
        startAutoClear();  // Start the next 12-hour cycle
    }, timeUntilNextClear);  // Clear slots at the next scheduled time
}

// Function to clear all slots
function resetAllSlots() {
    document.querySelectorAll('td input[type="text"]').forEach(input => {
        input.value = '';  // Clear the input value
        input.readOnly = false;  // Allow editing again
        input.classList.remove('occupied');  // Remove the occupied class
    });
    localStorage.removeItem('agentSlots');  // Clear all stored slots in localStorage
    agentSlots = {};  // Reset the object
    console.log('All slots cleared.');
}

// Toggle edit mode to clear individual slots with Ctrl + I
let isEditMode = false;

document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === 'i') {
        event.preventDefault();  // Prevent default Ctrl + I behavior
        isEditMode = !isEditMode;  // Toggle edit mode
        console.log(`Edit mode ${isEditMode ? 'ON' : 'OFF'}`);
    }
});

window.onload = () => {
    createTimeSlots();  // Initialize time slots
    displayCurrentTime();  // Display current time
    startAutoClear();  // Start the 12-hour auto-clear cycle
};

 const firebaseConfig = {
    apiKey: "AIzaSyA_ZfIN4L2lxv7nD9kMIXW-lHuvbR-9iyE",
    authDomain: "break-time-logger-db46a.firebaseapp.com",
    projectId: "break-time-logger-db46a",
    storageBucket: "break-time-logger-db46a.appspot.com",
    messagingSenderId: "46728777778",
    appId: "1:46728777778:web:15870f5ea02ba9cd7b2c2b",
    measurementId: "G-QY9QRWH3YZ"
  };

   
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);



