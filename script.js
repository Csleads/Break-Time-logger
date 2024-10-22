// Time zone for Georgia (Tbilisi)
const TIMEZONE = 'Asia/Tbilisi';

// Time slots with 6 slots per half-hour
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

        for (let i = 1; i <= 6; i++) {
            const cell = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'text';
            input.value = agentSlots[slot] && agentSlots[slot][i - 1] ? agentSlots[slot][i - 1] : '';
            input.placeholder = 'Enter Name';

            if (input.value) {
                input.classList.add('occupied');
                input.readOnly = true;
            }

            input.onchange = function () {
                updateSlot(slot, input.value, i);
                input.classList.add('occupied');
                input.readOnly = true;
            };

            cell.addEventListener('click', () => {
                if (isEditMode && input.value !== '') {
                    clearSlot(slot, i);
                }
            });

            cell.appendChild(input);
            row.appendChild(cell);
        }

        tableBody.appendChild(row);
    });
}

// Function to clear a specific slot
function clearSlot(timeSlot, agentNumber) {
    if (agentSlots[timeSlot]) {
        agentSlots[timeSlot][agentNumber - 1] = '';
        localStorage.setItem('agentSlots', JSON.stringify(agentSlots));
        location.reload();
    }
}

// Function to update the agent slot and save to localStorage
function updateSlot(slot, agentName, slotNumber) {
    if (!agentSlots[slot]) {
        agentSlots[slot] = [];
    }
    agentSlots[slot][slotNumber - 1] = agentName;
    localStorage.setItem('agentSlots', JSON.stringify(agentSlots));
}

// Function to clear all slots
function resetAllSlots() {
    document.querySelectorAll('td input[type="text"]').forEach(input => {
        input.value = '';
        input.readOnly = false;
        input.classList.remove('occupied');
    });
    localStorage.removeItem('agentSlots');
}

// Toggle the visibility of the reset button with Ctrl + I
let isResetButtonVisible = false;
let isEditMode = false;

document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === 'i') {
        event.preventDefault();
        const resetButton = document.getElementById('adminResetButton');
        if (!isResetButtonVisible) {
            resetButton.style.display = 'inline-block';
            isEditMode = true;
        } else {
            resetButton.style.display = 'none';
            isEditMode = false;
        }
        isResetButtonVisible = !isResetButtonVisible;
    }
});

// Function to reset daily at 08:00 Tbilisi time
function resetDailyAt8AM() {
    const now = new Date().toLocaleString("en-US", { timeZone: TIMEZONE });
    const currentDateTime = new Date(now);

    if (currentDateTime.getHours() === 8 && currentDateTime.getMinutes() === 0 && currentDateTime.getSeconds() === 0) {
        resetAllSlots();
    }
}

window.onload = () => {
    createTimeSlots();
    displayCurrentTime();
    setInterval(resetDailyAt8AM, 1000);
};
