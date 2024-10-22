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
        
        // Create the time slot cell (label)
        const timeCell = document.createElement('td');
        timeCell.textContent = slot;
        row.appendChild(timeCell);

        // Create 4 slots for each time
        for (let i = 1; i <= 4; i++) {
            const cell = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'text';
            input.value = agentSlots[slot] && agentSlots[slot][i - 1] ? agentSlots[slot][i - 1] : '';
            input.placeholder = 'Enter Name';

            // If the name was already entered, add occupied class and make the input read-only
            if (input.value) {
                input.classList.add('occupied'); // Add modern border effect
                input.readOnly = true;
            }

            // Update localStorage and add modern effect after entry
            input.onchange = function () {
                updateSlot(slot, input.value, i);
                input.classList.add('occupied');  // Add occupied border effect
                input.readOnly = true;            // Make the input read-only
            };

            cell.appendChild(input);
            row.appendChild(cell);
        }

        tableBody.appendChild(row);
    });
}

// Function to update the agent slot and save to localStorage
function updateSlot(slot, agentName, slotNumber) {
    if (!agentSlots[slot]) {
        agentSlots[slot] = [];
    }
    agentSlots[slot][slotNumber - 1] = agentName;

    // Save updated slots to localStorage
    localStorage.setItem('agentSlots', JSON.stringify(agentSlots));
}

// Function to clear all inputs and reset the localStorage
function resetAllSlots() {
    console.log("Resetting all slots to empty values.");
    // Clear all inputs from the UI
    document.querySelectorAll('td input[type="text"]').forEach(input => {
        input.value = '';
        input.readOnly = false; // Allow editing again after reset
        input.classList.remove('occupied');  // Remove the occupied class
    });

    // Clear the localStorage
    localStorage.removeItem('agentSlots');
    agentSlots = {};
}

// Function to reset daily at 08:00 Tbilisi time
function resetDailyAt8AM() {
    const now = new Date().toLocaleString("en-US", { timeZone: TIMEZONE });
    const currentDateTime = new Date(now);

    // Reset at exactly 08:00:00 Tbilisi time
    if (currentDateTime.getHours() === 8 && currentDateTime.getMinutes() === 0 && currentDateTime.getSeconds() === 0) {
        resetAllSlots();  // Call reset function
    }
}

// Create the time slots on page load
window.onload = () => {
    createTimeSlots();
    displayCurrentTime();

    // Check every second to reset at 08:00:00
    setInterval(resetDailyAt8AM, 1000);
};
