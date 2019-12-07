/**
 * Configuration.
 */

// Name of your JavaScript file.
// This is the file exported by PICO-8 upon running the `export <your game name>.html` command.
const ScriptName = "jelpi.js";

// Display name of cart.
// This is used in the "Add <game> to Home Screen" button.
const CartName = "Jelpi";

/**
 * PICO-8 globals.
 */

// When `pico8_buttons` is defined globally, PICO-8 reads each int as a bitfield
// holding that player's button states.
//
// Possible button states:
//
//   0x1  left
//   0x2  right
//   0x4  up
//   0x8  down
//   0x10 o
//   0x20 x
//   0x40 menu
//
const pico8_buttons = [0, 0, 0, 0, 0, 0, 0, 0]; // Max 8 players.

// When `pico8_audio_context` is defined globally, PICO-8 will manipulate the
// AudioContext referenced by `pico8_audio_context`, instead of creating one of
// its own.
let pico8_audio_context = null;

// PICO-8's JavaScript looks at `Module.canvas` to access the <canvas> element.
// We initialize `Module.canvas` before loading PICO-8's JavaScript, see the
// <Game /> component.
const Module = {
  canvas: null
};

// Platform detection
const getMobileDetect = userAgent => {
  const isAndroid = () => Boolean(userAgent.match(/Android/i));
  const isIos = () => Boolean(userAgent.match(/iPhone|iPad|iPod/i));
  const isOpera = () => Boolean(userAgent.match(/Opera Mini/i));
  const isWindows = () => Boolean(userAgent.match(/IEMobile/i));

  const isMobile = () => Boolean(isAndroid() || isIos() || isOpera() || isWindows());
  const isDesktop = () => !isMobile();
  return {
    isMobile,
    isDesktop,
    isAndroid,
    isIos
  };
};

const useMobileDetect = () => {
  React.useEffect(() => {}, []);
  return getMobileDetect(navigator.userAgent);
};

// Orientation detection
function isOrientationPortrait() {
  return (window.matchMedia("(orientation: portrait)")).matches;
}

/**
 * React components.
 */

const GameState = {
  Paused: "Paused",
  Loading: "Loading",
  Active: "Active"
};

// <AddToHomeScreen /> displays an "Add <game> to Home Screen" button if conditions are met.
function AddToHomeScreenButton({ gameName, style }) {
  if (!gameName) {
    throw new Error(`<AddToHomeScreenButton /> requires a gameName property.`);
  }

  // If the add-to-home criteria are met, the browser will emit a
  // 'beforeinstallprompt' event.
  //
  // Save this event, so that we can call .prompt() on the event when the user
  // clicks our "Add <game> to Home Screen" button.

  const [
    beforeInstallPromptEvent,
    setBeforeInstallPromptEvent
  ] = React.useState(null);

  React.useEffect(() => {
    window.addEventListener("beforeinstallprompt", setBeforeInstallPromptEvent);
  });

  if (!beforeInstallPromptEvent) {
    return null;
  }

  return (
    <div
      style={{
        color: "#222",
        fontFamily: "sans-serif",
        textTransform: "uppercase",
        fontSize: "0.6rem",
        backgroundColor: "white",
        padding: "8px 16px",
        ...style
      }}
      id="AddToHomeScreenStyledInAppCSS"
      onClick={async () => {
        console.log("Prompting user...", beforeInstallPromptEvent.userChoice);
        beforeInstallPromptEvent.prompt();

        // Prompt the user to install the app.
        const choice = await beforeInstallPromptEvent.userChoice;
        if (choice.outcome === "accepted") {
          console.log("User installed:", choice);
        } else {
          console.log("User dismissed:", choice);
        }

        console.log("Prompted user.");
      }}
    >
      Add {gameName} to Home Screen
    </div>
  );
}

// <GameShell /> contains the entirety of your game, and surrounding game controls.
function GameShell({ canvasIdentifier }) {
  if (!canvasIdentifier) {
    throw new Error("<GameShell /> requires a `canvasIdentifier` property.");
  }

  const [gameState, setGameState] = React.useState(GameState.Paused);
  const [isOPressed, setOPressed] = React.useState(false);
  const [isXPressed, setXPressed] = React.useState(false);
  const [isSoundOn, setSoundOn] = React.useState(true);
  const [isMenuOn, setMenuOn] = React.useState(false);
  const [isControlsOn, setControlsOn] = React.useState(false);
  const [isFullscreenOn, setFullscreenOn] = React.useState(false);
  const [isPortrait, setPortrait] = React.useState(isOrientationPortrait());

  React.useEffect(() => {
    window.addEventListener("orientationchange", function() {
      setPortrait(!isOrientationPortrait());
    });
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div
        style={{
          flex: 1,
          alignSelf: "stretch",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 32,
          paddingBottom: 40
        }}
      >
        <img alt="pico8" src="./images/pico8_logo_vector.png" width={100} />
        <AnalogStick areaRadius={50} threshold={30} stickRadius={20} isPortrait={isPortrait} />
      </div>
      <div
        style={{
          flex: 1,
          position: "relative",
          display: "flex",
          justifyContent: "center"
        }}
      >
        <Game
          gameState={gameState}
          setGameState={setGameState}
          canvasIdentifier={canvasIdentifier}
        />
        <AddToHomeScreenButton
          gameName={CartName}
          style={{ position: "absolute" }}
        />
      </div>
      <div
        style={{
          flex: 1,
          alignSelf: "stretch",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          paddingTop: 32,
          paddingBottom: 40
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
           <FullscreenMenu
            isFullscreenOn={isFullscreenOn}
            setFullscreenOn={isFullscreenOnNow => {
              if (gameState !== GameState.Active) return;
              var is_fullscreen=(document.fullscreenElement || document.mozFullScreenElement || document.webkitIsFullScreen || document.msFullscreenElement);
              if (is_fullscreen)
		          {
                  if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                       
                    }
                   
                } else {
		
		            var el = document.getElementById(canvasIdentifier);
		          if ( el.requestFullscreen ) {
		            	el.requestFullscreen();
		            } else if ( el.mozRequestFullScreen ) {
		            	el.mozRequestFullScreen();
		            } else if ( el.webkitRequestFullScreen ) {
		              	el.webkitRequestFullScreen( Element.ALLOW_KEYBOARD_INPUT );
                }
              }
              setFullscreenOn(is_fullscreen);
            }}
          />
          <SoundSwitch
            isSoundOn={isSoundOn}
            setSoundOn={isSoundOnNow => {
              if (gameState !== GameState.Active) return;
              Module.pico8ToggleSound(isSoundOnNow);
              setSoundOn(isSoundOnNow);
            }}
            isPortrait={isPortrait}
          />
          <HamburgerMenu
            isMenuOn={isMenuOn}
            setMenuOn={isMenuOnNow => {
              if (gameState !== GameState.Active) return;
              Module.pico8TogglePaused(isMenuOnNow);
              setMenuOn(isMenuOnNow);
            }}
            isPortrait={isPortrait}
            style={{ marginTop: 8 }}
          />
          <ControlsMenu
            isControlsOn={isControlsOn}
            setControlsOn={isControlsOnNow => {
              if (gameState !== GameState.Active) return;
              Module.pico8ToggleControlMenu(isControlsOnNow);
              setControlsOn(isControlsOnNow);
            }}
            style={{ marginTop: 8 }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            position: "relative",
            top: -30
          }}
        >
          <XButton
            isPressed={isXPressed}
            setPressed={isXPressedNow => {
              pico8_buttons[0] = updateXButton(pico8_buttons[0], isXPressedNow);
              setXPressed(isXPressedNow);
            }}
            style={{
              position: "relative",
              top: 20
            }}
            isPortrait={isPortrait}
          />
          <OButton
            isPressed={isOPressed}
            setPressed={isOPressedNow => {
              pico8_buttons[0] = updateOButton(pico8_buttons[0], isOPressedNow);
              setOPressed(isOPressedNow);
            }}
            style={{
              marginLeft: 10
            }}
            isPortrait={isPortrait}
          />
        </div>
      </div>
      {gameState !== GameState.Active && (
        <PlayButton
          style={{ position: "absolute" }}
          onClick={() => {
            // Set up audio. Must call this inside a click handler for iOS audio to work.
            createAudioContext();

            // Update game state.
            setGameState(GameState.Loading);
          }}
          isPortrait={isPortrait}
        />
      )}
    </div>
  );
}

// <PlayButton /> displays the standard PICO-8 play button.
function PlayButton({ style, onClick, isPortrait }) {
  if (!onClick) {
    throw new Error(`<PlayButton /> requires an onClick property.`);
  }

  return ( isPortrait && useMobileDetect().isMobile() ? (
    <img
    alt="rotate phone"
    src="images/rotate.gif"
    style={{ position: "absolute" }}
    />
    ) : (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style
      }}
    >
      <div style={{ position: "relative" }}>
        <img
          alt="play game"
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAABpklEQVR42u3au23DQBCEYUXOXIGKcujQXUgFuA0XIKgW90Q9oEAg+Ljd27vd2RsCf058gEDqhofPj+OB6SMCAQlIQAIyAhKQgARkBAQDnM6XSRsB7/2e/tSA0//12fCAKsQX3ntDA4oRFwBRIc0AixE38BAhTQGLEAsBUSDNAXcRhYDRIZsAPlp99VECRoXsDpgN0g0wC6Q7IDpkGEBUyG6A0+vKBtkdMBukG2AWSHdAdMgwgKiQ4QDRIMMCokCGB4wOCQPYFVKw2cABNocUjl6wgE0gFashPKAZpHJ2TQNYBVmxW6cDFENWDv9pAUshCVgJScBKSAISkD9hPkT4GkNAMdzepyj8Kye852EBLe51CZHHWQK4JcThD1SlcHPEYY/0a+A0n6SkGZV6w6WZNb3g4Id1b7hwgGhwYQBR4dwB0eHcALPAdQfMBhcOEA0uDCAqnDsgOpwbYBa4poA/31+rZYFrBriFpwGMCtcEcA9PAhgdzhywBK8EEQXOFFCCtwaIBmcGKMWbI6LCmQBq8R6hw5kAMgISkIAEJCAjIAEJSEBGQI9ukV7lRn9nD+gAAAAASUVORK5CYII="
          style={{ position: "absolute" }}
          id="PlayButtonStyledInAppCSS"
          onContextMenu={e => e.preventDefault()}
          onClick={onClick}
        />
      </div>
    </div>
  ));
}

// <Game /> contains the actual PICO-8 game.
function Game({ gameState, setGameState, canvasIdentifier }) {
  if (!gameState) throw new Error("<Game /> requires a `gameState` prop.");
  if (!(gameState in GameState))
    throw new Error(`gameState property is invalid: ${gameState}`);
  if (!setGameState)
    throw new Error("<Game /> requires a `setGameState` property.");
  if (!canvasIdentifier)
    throw new Error("<Game /> requires a canvasIdentifier.");

  // Start the game if we transitioned from paused to active.
  React.useEffect(() => {
    (async () => {
      if (gameState === GameState.Loading) {
        // Load game.
        await loadGameScript(ScriptName);

        // Update state.
        setGameState(GameState.Active);
      }
    })();
  }, [gameState]);

  // PICO-8's JavaScript sets the <canvas> size to 128x128,
  // so we need to hack/override that behavior.
  React.useEffect(() => {
    requestAnimationFrame(maintainCanvasSize);
  });

  // Initialize `Module.canvas` reference.
  React.useEffect(() => {
    Module.canvas = document.getElementById(canvasIdentifier);
  });

  // TODO(jason): Can refactor to use React refs, so we don't have to set the width and height twice.
  const width = canvasWidth();
  return (
    <canvas
      id={canvasIdentifier}
      style={{ backgroundColor: "black" }}
      width={width}
      height={width}
    />
  );
}

// <SoundSwitch /> toggles PICO-8's sound on or off.
function SoundSwitch({ isSoundOn, setSoundOn, isPortrait }) {
  if (!setSoundOn) {
    throw new Error("<SoundSwitch /> requires a setSoundOn callback.");
  }

  if (useMobileDetect().isDesktop() || !isPortrait) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: 32,
        alignSelf: "stretch",
        justifyContent: "center",
      }}
      onClick={() => {
        setSoundOn(!isSoundOn);
      }}
    >
      <div
        style={{
          height: 24,
          width: 24,
          overflow: "hidden",
          position: "relative",
          left: 2
        }}>
      {isSoundOn ? (
        <img
          alt="sound on"
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAPUlEQVRIx2NgGDHg/8cX/5Hx0LEA3cChYwEugwhZQLQDqG4BsZFIKMhGLRi1YChbMPRz8vArTYdPjTboAQCSVgpXUWQAMAAAAABJRU5ErkJggg=="
        />
      ) : (
        <img
          alt="sound off"
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAANklEQVRIx2NgGDHg/8cX/5Hx0LEA3cChYwEugwavBcRG4qgFoxYMZwuGfk4efqXp8KnRBj0AAMz7cLDnG4FeAAAAAElFTkSuQmCC"
        />
      )}
    </div></div>
  );
  }
  return null;
}

// <HamburgerMenu /> toggles PICO-8's menu on or off.
function HamburgerMenu({ isMenuOn, setMenuOn, isPortrait, style }) {
  if (!setMenuOn) {
    throw new Error("<HamburgerMenu /> requires an `setMenuOn` property.");
  }
 
  if (useMobileDetect().isMobile() && !isPortrait) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: 32,
        alignSelf: "stretch",
        justifyContent: "center",
        ...style
      }}
      onClick={() => {
        setMenuOn(!isMenuOn);
      }}
    >
      <div
        style={{
          height: 10,
          width: 24,
          overflow: "hidden",
          position: "relative",
          left: 2
        }}
      >
        <img
          alt="toggle menu"
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAKUlEQVRIx2NgGHbg/8cX/7FhctWNWjBqwagFoxaMWjBqwagF5Fkw5AAAPaGZvsIUtXUAAAAASUVORK5CYII="
          style={{ position: "absolute", transform: "rotate(90deg)", top: -2 }}
        />
      </div>
    </div>
  );
  }
  return null;
}

// <ControlsMenu /> toggles overlay of PICO-8 controls on or off.
function ControlsMenu({ isControlsOn, setControlsOn, style }) {
  if (!setControlsOn) {
    throw new Error("<ControlsMenu /> requires an `setControlsOn` property.");
  }

  if(useMobileDetect().isDesktop()) {
  return ( 
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: 64,
        alignSelf: "stretch",
        justifyContent: "center",
        ...style
      }}
      onClick={() => {
        setControlsOn(!isControlsOn);
      }}
    >
      <div
        style={{
          height: 24,
          width: 24,
          overflow: "hidden",
          position: "relative",
          left: 2
        }}
      >
        <img
          alt="toggle controls"
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAQ0lEQVRIx2NgGAXEgP8fX/ynBaap4XBLhqcF1IyfYWQBrZLz0LEAlzqqxQFVLcAmT3MLqJqTaW7B4CqLaF4fjIIBBwBL/B2vqtPVIwAAAABJRU5ErkJggg=="
          style={{ position: "absolute", top: -2 }}
        />
      </div>
    </div>
    ); 
  }
  return null;
}

// <FullscreenMenu /> toggles fullscreen mode on or off.
function FullscreenMenu({ isFullscreenOn, setFullscreenOn, style }) {
  if (!setFullscreenOn) {
    throw new Error("<FullscreenMenu /> requires an `setFullscreenOn` property.");

  }
  if(useMobileDetect().isDesktop()) {
  return (  
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: 64,
        alignSelf: "stretch",
        justifyContent: "center",
        ...style
      }}
      onClick={() => {
        setFullscreenOn(!isFullscreenOn);
      }}
    >
      <div
        style={{
          height: 24,
          width: 24,
          overflow: "hidden",
          position: "relative",
          left: 2
        }}
      >
        <img
          alt="toggle fullscreen"
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAN0lEQVRIx2NgGPLg/8cX/2mJ6WcBrUJm4CwgOSgGrQVEB8WoBaMWDGMLhm5OHnql6dCt0YY8AAA9oZm+9Z9xQAAAAABJRU5ErkJggg=="
          style={{ position: "absolute", top: -2 }}
        />
      </div>
    </div>
    );
  }
  return null;
}

// <AnalogStick /> simulates an analog touch input that controls PICO-8.
// areaRadius defines the radius (in pixels) of the analog stick's area.
// threshold defines the threshold radius (in pixels) at which a direction button becomes pressed.
// stickRadius defines the display radius (in pixels) of stick itself.
function AnalogStick({ areaRadius, threshold, stickRadius, isPortrait }) {
  if (!areaRadius)
    throw new Error(`<AnalogStick /> requires an areaRadius property.`);
  if (!threshold)
    throw new Error(`<AnalogStick /> requires a threshold property.`);
  if (!stickRadius)
    throw new Error(`<AnalogStick /> requires a stickRadius property.`);

  const divRef = React.createRef();

  // Note that these xy-coordinates are relative to the top-left of the analog stick area.
  // Example:
  //
  //   +-------
  //   | (x,y)
  //   |
  const [analogStickX, setAnalogStickX] = React.useState(areaRadius);
  const [analogStickY, setAnalogStickY] = React.useState(areaRadius);

  const handleMove = e => {
    // Extract fields from touch event.
    const { left, top } = divRef.current.getBoundingClientRect();
    const touchObj = extractRelevantFields(e.changedTouches[0]);

    // Determine X and Y when the origin is at the center of the analog stick area.
    let x = touchObj.clientX - left - areaRadius;
    let y = touchObj.clientY - top - areaRadius;

    // Determine distance from center.
    const dist = Math.sqrt(x ** 2 + y ** 2);

    // Clamp analog stick to edge of analog stick area.
    if (dist > areaRadius) {
      x = (x / dist) * areaRadius;
      y = (y / dist) * areaRadius;
    }

    // Update analog stick position.
    setAnalogStickX(x + areaRadius);
    setAnalogStickY(y + areaRadius);

    // Determine if analog stick threshold is exceeded for D-pad emulation.
    const isThresholdExceeded = dist > threshold;

    // Rotate coordinate system clockwise by 45 degrees so we can determine the
    // analog stick's quadrant.
    //
    //     |
    // left| up
    // ----+----
    // down| right
    //     |
    const [rx, ry] = rotate([x, y]);
    const isUp = rx >= 0 && ry <= 0;
    const isLeft = rx < 0 && ry <= 0;
    const isDown = rx < 0 && ry > 0;
    const isRight = rx >= 0 && ry > 0;

    // Update PICO-8 global state.
    if (isThresholdExceeded) {
      pico8_buttons[0] = updateDirectionPad(pico8_buttons[0], {
        left: isLeft,
        right: isRight,
        up: isUp,
        down: isDown
      });
    } else {
      pico8_buttons[0] = updateDirectionPad(pico8_buttons[0], {
        left: false,
        right: false,
        up: false,
        down: false
      });
    }
  };

  if (useMobileDetect().isMobile() && !isPortrait) {
  return (
    <div
      style={{
        backgroundColor: "gray",
        borderRadius: "50%",
        width: areaRadius * 2,
        height: areaRadius * 2,
        position: "relative"
      }}
      onContextMenu={e => e.preventDefault()}
      ref={divRef}
      onTouchStart={handleMove}
      onTouchMove={handleMove}
      onTouchEnd={e => {
        // Reset analog stick to center of analog stick area.
        setAnalogStickX(areaRadius);
        setAnalogStickY(areaRadius);

        // Update PICO-8 global state.
        pico8_buttons[0] = updateDirectionPad(pico8_buttons[0], {
          left: false,
          right: false,
          up: false,
          down: false
        });
      }}
    >
      <div
        style={{
          backgroundColor: "lightgray",
          width: stickRadius * 2,
          height: stickRadius * 2,
          left: analogStickX - stickRadius,
          top: analogStickY - stickRadius,
          position: "absolute",
          borderRadius: "50%"
        }}
      />
    </div>
  );
  }
  return null;
}

const ButtonStyles = {
  width: 50,
  height: 50,
  border: "solid 1px white",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "sans-serif",
  color: "white",
  fontWeight: 100
};

const XButtonStyles = {
  backgroundColor: "blue",
}

const OButtonStyles = {
  backgroundColor: "green",
}

const ActiveStyles = {
  backgroundColor: "white",
  color: "#222"
};

// <OButton /> controls PICO-8's 'O' button state.
function OButton({ isPressed, setPressed, isPortrait, style: customStyle }) {
  if (isPressed === undefined)
    throw new Error("<OButton /> is missing an `isPressed` property.");
  if (!setPressed)
    throw new Error("<OButton /> is missing a `setPressed` property.");

    const style = isPressed
    ? { ...ButtonStyles, ...OButtonStyles, ...ActiveStyles }
    : { ...ButtonStyles, ...OButtonStyles };

  if (useMobileDetect().isMobile() && !isPortrait) {
  return (
    <div
      style={{ ...style, ...customStyle }}
      onContextMenu={e => e.preventDefault()}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      onTouchCancel={() => setPressed(false)}
    >
    </div>
  );
  }
  return null;
}

// <XButton /> controls PICO-8's 'X' button state.
function XButton({ isPressed, setPressed, isPortrait, style: customStyle }) {
  if (isPressed === undefined)
    throw new Error("<XButton /> is missing an `isPressed` property.");
  if (!setPressed)
    throw new Error("<XButton /> is missing a `setPressed` property.");

    const style = isPressed
    ? { ...ButtonStyles, ...XButtonStyles, ...ActiveStyles }
    : { ...ButtonStyles, ...XButtonStyles };
  
    if (useMobileDetect().isMobile() && !isPortrait) {
    return (
    <div
      style={{ ...style, ...customStyle }}
      onContextMenu={e => e.preventDefault()}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      onTouchCancel={() => setPressed(false)}
    >
    </div>
  );
  }
  return null;
}

/**
 * Utils.
 */

// updateDirectionPad returns a new button state, given the current state of the direction pad.
function updateDirectionPad(buttonState, { left, right, up, down }) {
  // Save current state of other buttons.
  const otherButtons = buttonState & ~(0x1 + 0x2 + 0x4 + 0x8);

  // Determine new direction pad state.
  let directionPad = 0;
  if (left) directionPad += 0x1;
  if (right) directionPad += 0x2;
  if (up) directionPad += 0x4;
  if (down) directionPad += 0x8;

  // Return updated state.
  return otherButtons + directionPad;
}

// updateOButton returns a new button state, given the current state of the O button.
function updateOButton(buttonState, isDown) {
  // Save current state of other buttons.
  const otherButtons = buttonState & ~0x10;

  // Determine new O button state.
  const oButton = isDown ? 0x10 : 0;

  // Return updated state.
  return otherButtons + oButton;
}

// updateXButton returns a new button state, given the current state of the X button.
function updateXButton(buttonState, isDown) {
  // Save current state of other buttons.
  const otherButtons = buttonState & ~0x20;

  // Determine new O button state.
  const oButton = isDown ? 0x20 : 0;

  // Return updated state.
  return otherButtons + oButton;
}

// loadGameScript loads the JavaScript exported by PICO-8.
async function loadGameScript(scriptName) {
  console.log("Loading game script...");

  // Create <script> element.
  const script = document.createElement("script");
  script.type = "application/javascript";
  script.src = scriptName;

  // Load script.
  document.body.appendChild(script);

  // Define onload handler as a Promise.
  return new Promise((resolve, reject) => {
    script.onload = (...args) => {
      console.log("Loaded game script. Module API:", Module);
      resolve(args);
    };
    script.onerror = (...args) => {
      console.log("Failed to load game script.");
      reject(args);
    };
  });
}

// Extract relevant fields from a TouchEvent.
function extractRelevantFields(touchEvent) {
  const { identifier, clientX, clientY } = touchEvent;
  return { identifier, clientX, clientY };
}

// Create an AudioContext that also works on iOS.
function createAudioContext() {
  // Resume AudioContext if already created.
  if (pico8_audio_context) {
    pico8_audio_context.resume();
    return;
  }

  // Grab API object.
  const AudioContext =
    window.AudioContext ||
    window.webkitAudioContext ||
    window.mozAudioContext ||
    window.oAudioContext ||
    window.msAudioContext;

  // Create context object.
  pico8_audio_context = new AudioContext();
  const source = pico8_audio_context.createBufferSource();
  source.buffer = pico8_audio_context.createBuffer(1, 1, 22050);
  source.connect(pico8_audio_context.destination);

  // Wake up audio on iOS.
  if (source.noteOn) {
    source.noteOn(0);
  } else {
    source.start(0);
  }
}

// rotate a 2D vector by `angle` radians.
//
// Note that the Y axis points down. So rotations are clockwise.
//
// The default rotation is 45 degrees (clockwise).
function rotate([x, y], angle = 0.785398163) {
  const { cos, sin } = Math;
  const x2 = cos(angle) * x - sin(angle) * y;
  const y2 = sin(angle) * x + cos(angle) * y;
  return [x2, y2];
}

// Determine the width of the game canvas given the current window size.
function canvasWidth() {
  const { innerWidth, innerHeight } = window;
  return Math.min(innerWidth, innerHeight);
}

// Hack around PICO-8 script to ensure the game <canvas> has the correct size.
function maintainCanvasSize() {
  // Set canvas size.
  // TODO(jason): Can refactor this to use React refs.
  const canvasWidthString = `${canvasWidth()}px`;
  if (typeof Module !== "undefined" && Module.canvas) {
    Module.canvas.style.width = canvasWidthString;
    Module.canvas.style.height = canvasWidthString;
  }

  // Repeat.
  requestAnimationFrame(maintainCanvasSize);
}

/**
 * Initialize our app.
 */

// Render the game shell.
{
  // Declare identifier for <canvas> element.
  const canvasIdentifier = "My PICO-8 Game";

  // Render app.
  const container = document.createElement("div");
  ReactDOM.render(<GameShell canvasIdentifier={canvasIdentifier} />, container);
  document.body.prepend(container);
}

// Register service worker.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    // Since service_worker.js is at the root path, the service worker will
    // control all requests to / and subpaths.
    const registration = await navigator.serviceWorker.register(
      "/service_worker.js"
    );
    console.log("Registered Service Worker:", registration);
  });
}

// Show a prompt after the user installs the app.
// You can customize behavior here – this is just for debugging.
window.addEventListener("appinstalled", event => {
  console.log("App was installed:", event);
  alert("App was installed.");
});
