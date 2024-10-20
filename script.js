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

            // Update localStorage on change
            input.onchange = function () {
                updateSlot(slot, input.value, i);
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

// Clear all slots and reset localStorage at the end of the day
function resetDailySlots() {
    const now = new Date();
    const resetHour = 8; // Reset at 8:00 AM Georgian time

    if (now.getHours() === resetHour && now.getMinutes() === 0) {
        localStorage.removeItem('agentSlots');
        agentSlots = {};
        document.querySelectorAll('td input[type="text"]').forEach(input => input.value = '');
    }
}

// Create the time slots on page load
window.onload = () => {
    createTimeSlots();
    displayCurrentTime();

    // Check for daily reset every minute
    setInterval(resetDailySlots, 60000); // Check every minute
};
