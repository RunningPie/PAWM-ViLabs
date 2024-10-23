console.log("Script loaded");

const observer = lozad(); // lazy loads elements with default selector as '.lozad'
observer.observe();

document.addEventListener("DOMContentLoaded", () => {

    const images = document.querySelectorAll('.steps-grid .step img');

    if (images.length === 0) {
        console.log("No images found.");
        return; // Exit if no images are found
    }

    images.forEach(image => {
        // Log the initial source of each image
        console.log(`Initial image source: ${image.src}`);

        image.addEventListener('mouseover', () => {
            let currentSrc = image.src;

            // Change the source to .gif
            let newSrc = currentSrc.replace('.svg', '.gif');
            console.log(`Changing from ${currentSrc} to ${newSrc}`);

            // Directly set the new image source
            image.src = newSrc;
        });

        image.addEventListener('mouseout', () => {
            let currentSrc = image.src;

            // Change the source back to .svg
            let originalSrc = currentSrc.replace('.gif', '.svg');
            console.log(`Reverting from ${currentSrc} to ${originalSrc}`);

            // Directly set the original image source
            image.src = originalSrc;
        });
    });

    
});
