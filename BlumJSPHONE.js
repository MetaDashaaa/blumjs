// ==UserScript==
// @name         Blum Autoclicker
// @version      1.2
// @namespace    Violentmonkey Scripts
// @author       mudachyo
// @match        https://telegram.blum.codes/*
// @grant        none
// @icon         https://cdn.prod.website-files.com/65b6a1a4a0e2af577bccce96/65ba99c1616e21b24009b86c_blum-256.png
// ==/UserScript==

(() => {  
    if (window.BlumAC) return;
  
    window.BlumAC = true;
  
    const config = {
      autoPlay: true,
      greenColor: [208, 216, 0],
      tolerance: 5,
      playButtonSelector: "button.is-primary, .play-btn",
      canvasSelector: "canvas",
      playCheckInterval: 5000,
      objectCheckInterval: 100,
      excludedArea: { top: 70 }
    };
  
    // Tự động nhấn nút "Play"
    if (config.autoPlay) {
      setInterval(() => {
        const playButton = document.querySelector(config.playButtonSelector);
        if (playButton && playButton.textContent.toLowerCase().includes("play")) {
          playButton.click();
  
          // Chờ 3 giây trước khi bắt đầu quá trình tự động click
          setTimeout(() => {
            startAutoClick();
          }, 2000); // 3000ms = 3 giây
        }
      }, config.playCheckInterval);
    }
  
    // Hàm bắt đầu quá trình tự động touch
    function startAutoClick() {
      setInterval(() => {
        const canvas = document.querySelector(config.canvasSelector);
        if (canvas) detectAndClickObjects(canvas);
      }, config.objectCheckInterval);
    }
  
    function detectAndClickObjects(canvas) {
      const { width, height } = canvas;
      const context = canvas.getContext('2d');
      const imageData = context.getImageData(0, 0, width, height);
      const pixels = imageData.data;
  
      for (let y = config.excludedArea.top; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const index = (y * width + x) * 4;
          const [r, g, b] = [pixels[index], pixels[index + 1], pixels[index + 2]];
  
          if (isInGreenRange(r, g, b, config.greenColor, config.tolerance)) {
            simulateTouch(canvas, x, y);
          }
        }
      }
    }
  
    function isInGreenRange(r, g, b, greenColor, tolerance) {
      return greenColor.every((color, i) => Math.abs([r, g, b][i] - color) <= tolerance);
    }
  
    // Hàm mô phỏng sự kiện touch
    function simulateTouch(canvas, x, y) {
      const touchObj = new Touch({
        identifier: Date.now(),
        target: canvas,
        clientX: x,
        clientY: y,
        radiusX: 2.5,
        radiusY: 2.5,
        rotationAngle: 0,
        force: 1
      });
  
      const touchStartEvent = new TouchEvent('touchstart', {
        touches: [touchObj],
        targetTouches: [],
        changedTouches: [touchObj],
        bubbles: true,
        cancelable: true
      });
  
      canvas.dispatchEvent(touchStartEvent);
  
      const touchEndEvent = new TouchEvent('touchend', {
        touches: [],
        targetTouches: [],
        changedTouches: [touchObj],
        bubbles: true,
        cancelable: true
      });
  
      canvas.dispatchEvent(touchEndEvent);
    }
  })();
  