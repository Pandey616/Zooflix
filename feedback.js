//javascript for feedback submission
const feedbackForm = document.getElementById("feedback-form");
        
feedbackForm.addEventListener("submit", (event) => {
event.preventDefault();
        
// Show notification
const notification = document.getElementById("notification")
notification.style.display = "flex";
        
// Wait for 3 seconds and then remove notification
setTimeout(() => {
notification.remove();
}, 3000);
});