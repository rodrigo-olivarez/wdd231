const currentYear = new Date().getFullYear();
document.getElementById("currentYear").textContent = currentYear;

const modifiedText = `Last Modification: ${document.lastModified}`;
document.getElementById("lastModified").textContent = modifiedText;