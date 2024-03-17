const calendar = document.querySelector(".calendar"),
    date = document.querySelector(".date"),
    daysContainer = document.querySelector(".days"),
    prev = document.querySelector(".prev"),
    next = document.querySelector(".next"),
    todayBtn = document.querySelector(".today-btn"),
    gotoBtn = document.querySelector(".goto-btn"),
    dateInput = document.querySelector(".date-input"),
    eventDay = document.querySelector(".event-day"),
    eventDate = document.querySelector(".event-date"),
    eventsContainer = document.querySelector(".events"),
    addEventBtn = document.querySelector(".add-event"),
    addEventWrapper = document.querySelector(".add-event-wrapper "),
    addEventCloseBtn = document.querySelector(".close "),
    addEventTitle = document.querySelector(".event-name "),
    addEventFrom = document.querySelector(".event-time-from "),
    addEventTo = document.querySelector(".event-time-to "),
    addEventSubmit = document.querySelector(".add-event-btn ");

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

// Default Event Array
// const eventsArr = [
//     {
//         day: 13,
//         month: 11,
//         year: 2022,
//         events: [
//         {
//             title: "Event 1 lorem ipsun dolar sit genfa tersd dsad ",
//             time: "10:00 AM",
//         },
//         {
//             title: "WE GO JIM",
//             time: "11:00 AM",
//         },
//         ],
//     },
// ];

const eventsArr = [];
getEvents();
console.log(eventsArr);

// Add days
function initCalendar() {
    // Get prev month days, current month days, and next month days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);
    const prevDays = prevLastDay.getDate();
    const lastDate = lastDay.getDate();
    const day = firstDay.getDay();
    const nextDays = 7 - lastDay.getDay() - 1;

    // Update month and year at top of calendar
    date.innerHTML = months[month] + " " + year;

    // Adding days on dom
    let days = "";

    // Prev month days
    for (let x = day; x > 0; x--) {
        days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
    }

    // Current month days
    for (let i = 1; i <= lastDate; i++) {
        //check if event is present on that day
        let event = false;
        eventsArr.forEach((eventObj) => {
            if (
                eventObj.day === i &&
                eventObj.month === month + 1 &&
                eventObj.year === year
            ) {
                event = true;
            }
        });
        
        // If date is today, add class today
        if (
            i === new Date().getDate() &&
            year === new Date().getFullYear() &&
            month === new Date().getMonth()
            ) {
            activeDay = i;
            getActiveDay(i);
            updateEvents(i);

            // If event found also add event class
            // Add active on today at startup
            if (event) {
                days += `<div class="day today active event">${i}</div>`;
            } else {
                days += `<div class="day today active">${i}</div>`;
            }
        } 
        // Add remaining days
        else {
            if (event) {
                days += `<div class="day event">${i}</div>`;
            } else {
                days += `<div class="day ">${i}</div>`;
            }
        }
    }

    // Next month days
    for (let j = 1; j <= nextDays; j++) {
        days += `<div class="day next-date">${j}</div>`;
    }

    daysContainer.innerHTML = days;

    // Add listner after calendar initialized
    addListner();
}

// Function to add month and year on prev and next button
// Prev month
function prevMonth() {
    month--;
    if (month < 0) {
        month = 11;
        year--;
    }
    initCalendar();
}

// Next month
function nextMonth() {
    month++;
    if (month > 11) {
        month = 0;
        year++;
    }
    initCalendar();
}

// Add event listner on prev and next
prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

initCalendar();


// Function to add listner on days after rendered
function addListner() {
    const days = document.querySelectorAll(".day");
    days.forEach((day) => {
        day.addEventListener("click", (e) => {
            // Call active day after click
            getActiveDay(e.target.innerHTML);
            updateEvents(Number(e.target.innerHTML));

            // Set current day as active day
            activeDay = Number(e.target.innerHTML);
            
            // Remove active from already active day
            days.forEach((day) => {
                day.classList.remove("active");
            });

            // If clicked prev-date or next-date switch to that month
            if (e.target.classList.contains("prev-date")) {
                prevMonth();

                // Add active to clicked day after month is change
                setTimeout(() => {
                    // Add active where no prev-date or next-date
                    const days = document.querySelectorAll(".day");
                    days.forEach((day) => {
                        if (
                        !day.classList.contains("prev-date") &&
                        day.innerHTML === e.target.innerHTML
                        ) {
                        day.classList.add("active");
                        }
                    });
                }, 100);
            // Same with the next month
            } else if (e.target.classList.contains("next-date")) {
                nextMonth();

                // Add active to clicked day after month is changed
                setTimeout(() => {
                    const days = document.querySelectorAll(".day");
                    days.forEach((day) => {
                        if (
                        !day.classList.contains("next-date") &&
                        day.innerHTML === e.target.innerHTML
                        ) {
                        day.classList.add("active");
                        }
                    });
                }, 100);
            } else {
                // Remaing current month days
                e.target.classList.add("active");
            }
        });
    });
}


// Add goto today and goto date function
todayBtn.addEventListener("click", () => {
    today = new Date();
    month = today.getMonth();
    year = today.getFullYear();
    initCalendar();
});

dateInput.addEventListener("input", (e) => {
    // Allow only number and remove anything else
    dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");

    if (dateInput.value.length === 2) {
        // Add slash when two numbers entered
        dateInput.value += "/";
    }
    if (dateInput.value.length > 7) {
        // Not allowing user put more than 7 characters
        dateInput.value = dateInput.value.slice(0, 7);
    }

    // If backspace pressed
    if (e.inputType === "deleteContentBackward") {
        if (dateInput.value.length === 3) {
        dateInput.value = dateInput.value.slice(0, 2);
        }
    }
});

gotoBtn.addEventListener("click", gotoDate);


// Go to entered date Function
function gotoDate() {
    console.log("here");
    const dateArr = dateInput.value.split("/");
    // Data validation
    if (dateArr.length === 2) {
        if (dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4) {
            month = dateArr[0] - 1;
            year = dateArr[1];
            initCalendar();
            return;
        }
    }
    // If invalid date
    alert("Invalid Date");
}

// Show active day events and date at top
function getActiveDay(date) {
    const day = new Date(year, month, date);
    const dayName = day.toString().split(" ")[0];
    eventDay.innerHTML = dayName;
    eventDate.innerHTML = date + " " + months[month] + " " + year;
}


// Clock
setInterval(() => {
    const time = document.querySelector("#time");

    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes()
    let seconds = date.getSeconds();
    let day_night = "AM";

    if(hours > 12) {
        day_night = "PM";
        hours = hours - 12;
    }
    if(hours < 10) {
        hours = "0" + hours;
    }
    if(minutes < 10) {
        minutes = "0" + minutes;
    }
    if(seconds < 10) {
        seconds = "0" + seconds;
    }

    time.textContent = hours + ":" + minutes + ":" + seconds + " " + day_night;
})


// Show event of that day
function updateEvents(date) {
    let events = "";
    eventsArr.forEach((event) => {
        // Get events of active day only
        if (
            date === event.day &&
            month + 1 === event.month &&
            year === event.year
        ) {
            // Then show event on document
            event.events.forEach((event) => {
                events += `
                <div class="event">
                    <div class="title">
                        <i class="fas fa-circle"></i>
                        <h3 class="event-title">${event.title}</h3>
                    </div>
                    <div class="event-time">
                        <span class="event-time">${event.time}</span>
                    </div>
                </div>`;
            });
        }
    });

    // If nothing events found
    if (events === "") {
        events = `<div class="no-event">
                <h3>No Events</h3>
            </div>`;
    }

    eventsContainer.innerHTML = events;
    saveEvents();
}

// Add event function
addEventBtn.addEventListener("click", () => {
    addEventWrapper.classList.toggle("active");
});

addEventCloseBtn.addEventListener("click", () => {
    addEventWrapper.classList.remove("active");
});
document.addEventListener("click", (e) => {
    // If user click outside Add Event Container
    if (e.target !== addEventBtn && !addEventWrapper.contains(e.target)) {
        addEventWrapper.classList.remove("active");
    }
});

// Allow only 50 characters in Title
addEventTitle.addEventListener("input", (e) => {
    addEventTitle.value = addEventTitle.value.slice(0, 50);
});


// Time format in from and to time
addEventFrom.addEventListener("input", (e) => {
    // Remove anything else numbers
    addEventFrom.value = addEventFrom.value.replace(/[^0-9:]/g, "");

    // If two numbers entered, auto add :
    if (addEventFrom.value.length === 2) {
        addEventFrom.value += ":";
    }

    // Not letting user enter more than 5 characters
    if (addEventFrom.value.length > 5) {
        addEventFrom.value = addEventFrom.value.slice(0, 5);
    }
});

addEventTo.addEventListener("input", (e) => {
    // Remove anything else numbers
    addEventTo.value = addEventTo.value.replace(/[^0-9:]/g, "");

    // If two numbers entered, auto add :
    if (addEventTo.value.length === 2) {
        addEventTo.value += ":";
    }

    // Not letting user enter more than 5 characters
    if (addEventTo.value.length > 5) {
        addEventTo.value = addEventTo.value.slice(0, 5);
    }
});


// Function to add event to eventsArr
addEventSubmit.addEventListener("click", () => {
    const eventTitle = addEventTitle.value;
    const eventTimeFrom = addEventFrom.value;
    const eventTimeTo = addEventTo.value;
    if (eventTitle === "" || eventTimeFrom === "" || eventTimeTo === "") {
        alert("Please fill all the fields");
        return;
    }

    // Check correct time format 24 hour
    const timeFromArr = eventTimeFrom.split(":");
    const timeToArr = eventTimeTo.split(":");
    if (
        timeFromArr.length !== 2 ||
        timeToArr.length !== 2 ||
        timeFromArr[0] > 23 ||
        timeFromArr[1] > 59 ||
        timeToArr[0] > 23 ||
        timeToArr[1] > 59
    ) {
        alert("Invalid Time Format");
        return;
    }

    const timeFrom = convertTime(eventTimeFrom);
    const timeTo = convertTime(eventTimeTo);

    // Check if event is already added
    let eventExist = false;
    eventsArr.forEach((event) => {
        if (
            event.day === activeDay &&
            event.month === month + 1 &&
            event.year === year
        ) {
            event.events.forEach((event) => {
                if (event.title === eventTitle) {
                eventExist = true;
                }
            });
        }
    });

    if (eventExist) {
        alert("Event already added");
        return;
    }

    const newEvent = {
        title: eventTitle,
        time: timeFrom + " - " + timeTo,
    };

    console.log(newEvent);
    console.log(activeDay);


    let eventAdded = false;
    if (eventsArr.length > 0) {
        eventsArr.forEach((item) => {
        if (
            item.day === activeDay &&
            item.month === month + 1 &&
            item.year === year
        ) {
            item.events.push(newEvent);
            eventAdded = true;
            }
        });
    }

    if (!eventAdded) {
        eventsArr.push({
        day: activeDay,
        month: month + 1,
        year: year,
        events: [newEvent],
        });
    }

    console.log(eventsArr);
    addEventWrapper.classList.remove("active");
    addEventTitle.value = "";
    addEventFrom.value = "";
    addEventTo.value = "";
    updateEvents(activeDay);


    // Select active day and add event class if not added
    const activeDayEl = document.querySelector(".day.active");
    if (!activeDayEl.classList.contains("event")) {
        activeDayEl.classList.add("event");
    }
});


// Function to delete event when clicked on event
eventsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("event")) {
        // Validation
        if (confirm("Are you sure you want to delete this event?")) {
        const eventTitle = e.target.children[0].children[1].innerHTML;
        eventsArr.forEach((event) => {
            if (
            event.day === activeDay &&
            event.month === month + 1 &&
            event.year === year
            ) {
            event.events.forEach((item, index) => {
                if (item.title === eventTitle) {
                    event.events.splice(index, 1);
                }
            });

            //if no events left in a day then remove that day from eventsArr
            if (event.events.length === 0) {
                eventsArr.splice(eventsArr.indexOf(event), 1);

                //remove event class from day
                const activeDayEl = document.querySelector(".day.active");
                if (activeDayEl.classList.contains("event")) {
                    activeDayEl.classList.remove("event");
                }
            }
            }
        });

        updateEvents(activeDay);
        }
    }
});

// Save events in local storage Functio
function saveEvents() {
    localStorage.setItem("events", JSON.stringify(eventsArr));
}

// Get events from local storage Function
function getEvents() {
    // Check if events are already saved in local storage then return event else nothing
    if (localStorage.getItem("events") === null) {
        return;
    }
    eventsArr.push(...JSON.parse(localStorage.getItem("events")));
}


// Convert time to 24 hour format
function convertTime(time) {
    let timeArr = time.split(":");
    let timeHour = timeArr[0];
    let timeMin = timeArr[1];
    let timeFormat = timeHour >= 12 ? "PM" : "AM";
    timeHour = timeHour % 12 || 12;
    time = timeHour + ":" + timeMin + " " + timeFormat;
    return time;
}
