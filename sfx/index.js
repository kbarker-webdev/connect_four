export function playSoundFX (sound) {
    let mySound = new Audio("./sfx/" + sound);
    mySound.play();
}