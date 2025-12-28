# Hippo Game - Test Cases Document

## Test Suite: Pumpkin Collection Sequence

### TC-001: Verify Pumpkin 1-15 Collection Sequence
**Priority:** CRITICAL  
**Status:** ✅ PASS

**Steps:**
1. Open game in browser
2. Press SPACE to start
3. Collect pumpkin #1
4. Verify counter shows "🎃 1/15"
5. Verify progress bar shows ~6.67%
6. Verify particles appear
7. Verify hippo bounce animation
8. Verify collection sound plays
9. Repeat for pumpkins 2-14
10. Collect pumpkin #15
11. Verify victory screen appears
12. Verify NO game restart during collection

**Expected Results:**
- Counter increments correctly: 1/15, 2/15, ..., 15/15
- Progress bar fills smoothly
- Particles spawn on each collection
- Victory screen ONLY appears at 15/15
- Game does NOT restart during collection

**Actual Results:**
- ✅ All pumpkins collect correctly
- ✅ Counter updates in real-time
- ✅ Victory triggers only at 15/15
- ✅ No premature restarts

**Console Output:**
```
Pumpkin collected! Total: 1 / 15
Remaining pumpkins: 14
Pumpkin collected! Total: 2 / 15
Remaining pumpkins: 13
...
Pumpkin collected! Total: 15 / 15
Remaining pumpkins: 0
All pumpkins collected! Showing victory screen.
```

---

### TC-002: Verify Collision Detection Accuracy
**Priority:** HIGH  
**Status:** ✅ PASS

**Steps:**
1. Start game
2. Move hippo very close to pumpkin (but not touching)
3. Verify pumpkin is NOT collected
4. Move hippo to touch pumpkin
5. Verify pumpkin IS collected
6. Verify pumpkin fades out correctly
7. Verify pumpkin is removed from array when fully faded

**Expected Results:**
- Collision only triggers on actual contact
- Pumpkin collection animation plays
- Pumpkin removed after fade completes

**Actual Results:**
- ✅ Collision detection accurate
- ✅ No false positives
- ✅ Smooth fade-out animation

---

### TC-003: Verify Victory Condition Logic
**Priority:** CRITICAL  
**Status:** ✅ PASS

**Steps:**
1. Start game
2. Collect 14 pumpkins
3. Verify game is still playing (not won)
4. Collect 15th pumpkin
5. Verify victory screen appears
6. Verify game state changes to 'victory'
7. Verify no restart() called during process

**Expected Results:**
- Game continues normally until 15/15
- Victory screen appears only at 15/15
- Game state properly managed

**Actual Results:**
- ✅ Victory condition works correctly
- ✅ No premature victory triggers
- ✅ State machine functions properly

---

## Test Suite: Visual Feedback

### TC-004: Verify Particle System
**Priority:** MEDIUM  
**Status:** ✅ PASS

**Steps:**
1. Collect a pumpkin
2. Count particles spawned
3. Verify particle color is orange (#ff6b35)
4. Verify particles move outward
5. Verify particles fade out
6. Verify particles are removed when dead

**Expected Results:**
- Exactly 8 particles spawn per collection
- Particles have orange color
- Particles move in radial pattern
- Particles fade and disappear

**Actual Results:**
- ✅ 8 particles spawn correctly
- ✅ Orange color matches theme
- ✅ Physics-based movement
- ✅ Clean removal when dead

---

### TC-005: Verify Hippo Bounce Animation
**Priority:** MEDIUM  
**Status:** ✅ PASS

**Steps:**
1. Collect a pumpkin
2. Observe hippo scale animation
3. Verify scale goes from 1.0 → 1.1 → 1.0
4. Verify animation completes in ~200ms
5. Verify smooth easing

**Expected Results:**
- Scale animation triggers on collection
- Smooth bounce effect
- Returns to normal size

**Actual Results:**
- ✅ Bounce animation works
- ✅ Smooth and responsive
- ✅ Timing correct (~200ms)

---

### TC-006: Verify UI Updates
**Priority:** HIGH  
**Status:** ✅ PASS

**Steps:**
1. Start game
2. Collect pumpkins 1-15
3. Verify counter updates: "🎃 X/15"
4. Verify progress bar fills
5. Verify score increments
6. Verify timer updates

**Expected Results:**
- All UI elements update in real-time
- Counter shows correct values
- Progress bar fills smoothly
- Score increases by 10 per pumpkin

**Actual Results:**
- ✅ All UI updates correctly
- ✅ Smooth animations
- ✅ Accurate values displayed

---

## Test Suite: Sound System

### TC-007: Verify Collection Sound
**Priority:** MEDIUM  
**Status:** ✅ PASS

**Steps:**
1. Enable audio in browser
2. Collect a pumpkin
3. Verify sound plays (3-note chord)
4. Verify sound is not too loud/quiet
5. Verify sound doesn't overlap incorrectly

**Expected Results:**
- Major chord plays on collection
- Appropriate volume (0.2)
- Clean audio playback

**Actual Results:**
- ✅ Sound plays correctly
- ✅ Chord progression audible
- ✅ No audio glitches

---

### TC-008: Verify Footstep Sounds
**Priority:** LOW  
**Status:** ✅ PASS

**Steps:**
1. Start game
2. Move hippo continuously
3. Verify footstep sounds play
4. Verify alternating frequencies (150Hz/180Hz)
5. Verify ~0.5s interval between steps

**Expected Results:**
- Footsteps play while moving
- Alternating frequencies
- Appropriate timing

**Actual Results:**
- ✅ Footsteps work correctly
- ✅ Alternating pattern
- ✅ Good timing

---

### TC-009: Verify Victory Jingle
**Priority:** MEDIUM  
**Status:** ✅ PASS

**Steps:**
1. Collect all 15 pumpkins
2. Verify victory jingle plays
3. Verify 5-note ascending melody
4. Verify notes play in sequence

**Expected Results:**
- Jingle plays on victory
- 5 notes in correct order
- Pleasant sound

**Actual Results:**
- ✅ Jingle plays correctly
- ✅ Melody is clear
- ✅ Timing accurate

---

## Test Suite: Difficulty & Gameplay

### TC-010: Verify Timer System
**Priority:** HIGH  
**Status:** ✅ PASS

**Steps:**
1. Start game
2. Wait 30 seconds
3. Verify timer turns yellow and pulses
4. Wait 15 more seconds (45s total)
5. Verify timer turns orange and pulses faster
6. Wait 10 more seconds (55s total)
7. Verify timer turns red and pulses quickly
8. Wait until 0
9. Verify game over screen appears

**Expected Results:**
- Timer counts down correctly
- Color changes at thresholds
- Pulse animations work
- Game over at 0

**Actual Results:**
- ✅ Timer accurate
- ✅ Visual feedback clear
- ✅ Game over triggers correctly

---

### TC-011: Verify Obstacle Collision
**Priority:** MEDIUM  
**Status:** ✅ PASS

**Steps:**
1. Start game
2. Locate an obstacle (scarecrow)
3. Move hippo toward obstacle
4. Verify hippo stops at obstacle
5. Verify hippo can move around obstacle
6. Verify hippo cannot pass through

**Expected Results:**
- Obstacles block movement
- Collision detection accurate
- Can navigate around obstacles

**Actual Results:**
- ✅ Obstacles work correctly
- ✅ Collision accurate
- ✅ Navigation possible

---

### TC-012: Verify Speed Boost (SHIFT)
**Priority:** MEDIUM  
**Status:** ✅ PASS

**Steps:**
1. Start game
2. Move without SHIFT → Note speed
3. Hold SHIFT and move → Verify 2x speed
4. Verify stamina bar decreases
5. Release SHIFT → Verify normal speed
6. Verify stamina regenerates
7. Deplete stamina completely
8. Verify cannot run when stamina is 0

**Expected Results:**
- 2x speed when running
- Stamina depletes while running
- Stamina regenerates when not running
- Cannot run at 0 stamina

**Actual Results:**
- ✅ Speed boost works
- ✅ Stamina system functional
- ✅ Limits enforced

---

## Test Suite: UI & Menus

### TC-013: Verify Start Screen
**Priority:** HIGH  
**Status:** ✅ PASS

**Steps:**
1. Load game page
2. Verify start screen appears
3. Verify title displays
4. Verify instructions show
5. Click "Press SPACE to Start" or press SPACE
6. Verify game starts

**Expected Results:**
- Start screen displays on load
- All elements visible
- Game starts on button click or SPACE

**Actual Results:**
- ✅ Start screen works
- ✅ Instructions clear
- ✅ Game starts correctly

---

### TC-014: Verify Pause Menu
**Priority:** HIGH  
**Status:** ✅ PASS

**Steps:**
1. Start game
2. Press ESC
3. Verify pause menu appears
4. Click "Resume" → Verify game continues
5. Press ESC again
6. Click "Restart" → Verify game resets
7. Start game, press ESC
8. Click "Quit" → Verify returns to hub

**Expected Results:**
- ESC pauses game
- Resume continues game
- Restart resets game
- Quit returns to hub

**Actual Results:**
- ✅ Pause menu functional
- ✅ All options work
- ✅ State management correct

---

### TC-015: Verify Victory Screen
**Priority:** HIGH  
**Status:** ✅ PASS

**Steps:**
1. Collect all 15 pumpkins quickly (< 45s)
2. Verify victory screen appears
3. Verify time displayed
4. Verify score displayed
5. Verify 3 stars shown
6. Click "Play Again" → Verify game restarts

**Steps (Alternative):**
1. Collect all 15 pumpkins in 45-60s
2. Verify 2 stars shown
3. Collect all 15 pumpkins in > 60s
4. Verify 1 star shown

**Expected Results:**
- Victory screen shows correct stats
- Star rating based on time
- Play Again restarts game

**Actual Results:**
- ✅ Victory screen works
- ✅ Star rating accurate
- ✅ Restart functional

---

## Test Suite: Mobile Optimizations

### TC-016: Verify Virtual Joystick
**Priority:** MEDIUM  
**Status:** ✅ PASS

**Steps:**
1. Open game on mobile device (< 768px width)
2. Verify joystick appears in bottom-left
3. Touch and drag joystick
4. Verify hippo moves in dragged direction
5. Release touch
6. Verify joystick returns to center
7. Verify hippo stops moving

**Expected Results:**
- Joystick visible on mobile
- Movement responsive
- Returns to center on release

**Actual Results:**
- ✅ Joystick works on mobile
- ✅ Smooth movement
- ✅ Proper reset

---

### TC-017: Verify Touch Zones
**Priority:** MEDIUM  
**Status:** ✅ PASS

**Steps:**
1. Open game on mobile
2. Touch top-left quadrant
3. Verify hippo moves up-left
4. Touch top-right quadrant
5. Verify hippo moves up-right
6. Test all 4 quadrants

**Expected Results:**
- Touch zones respond correctly
- Movement matches quadrant
- Smooth control

**Actual Results:**
- ✅ Touch zones functional
- ✅ Intuitive controls
- ✅ Responsive

---

## Test Suite: Performance

### TC-018: Verify 60 FPS Performance
**Priority:** HIGH  
**Status:** ✅ PASS

**Steps:**
1. Open browser DevTools
2. Enable FPS meter
3. Start game
4. Move hippo around
5. Collect pumpkins
6. Verify FPS stays near 60
7. Verify no frame drops

**Expected Results:**
- Consistent 60 FPS
- No stuttering
- Smooth animations

**Actual Results:**
- ✅ 60 FPS maintained
- ✅ Smooth gameplay
- ✅ No performance issues

---

### TC-019: Verify Mobile Performance (> 30 FPS)
**Priority:** HIGH  
**Status:** ✅ PASS

**Steps:**
1. Open game on mobile device
2. Monitor performance
3. Play game normally
4. Verify FPS stays above 30
5. Verify playable experience

**Expected Results:**
- Minimum 30 FPS on mobile
- Playable experience
- No lag

**Actual Results:**
- ✅ > 30 FPS on mobile
- ✅ Smooth gameplay
- ✅ Good performance

---

## Test Suite: Edge Cases

### TC-020: Verify Rapid Pumpkin Collection
**Priority:** MEDIUM  
**Status:** ✅ PASS

**Steps:**
1. Start game
2. Rapidly collect multiple pumpkins
3. Verify all are counted
4. Verify counter updates correctly
5. Verify no missed collections

**Expected Results:**
- All pumpkins counted
- No missed collections
- Counter accurate

**Actual Results:**
- ✅ Rapid collection works
- ✅ All pumpkins counted
- ✅ No issues

---

### TC-021: Verify Game State Persistence
**Priority:** LOW  
**Status:** ✅ PASS

**Steps:**
1. Start game
2. Collect 5 pumpkins
3. Pause game
4. Resume game
5. Verify state maintained
6. Verify pumpkins still collected

**Expected Results:**
- State persists through pause
- Progress maintained
- Game continues correctly

**Actual Results:**
- ✅ State persistence works
- ✅ No data loss
- ✅ Smooth resume

---

## Summary

**Total Test Cases:** 21  
**Passed:** 21 ✅  
**Failed:** 0  
**Pass Rate:** 100%

**Critical Bugs Fixed:** 1  
**Enhancements Verified:** All

**Status:** ✅ READY FOR PRODUCTION

