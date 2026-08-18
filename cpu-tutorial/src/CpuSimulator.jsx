import { useState, useEffect } from "react";
import CpuDiagram, {getSignalColor} from "./CpuDiagram";
import { commonSteps, INSTRUCTION_MICROCODE, PROGRAM} from "./cpuSteps";
import { legend, COLORS} from "./cpuConstants";

function App() {
  
  // "currentIndex" could maybe change its name to "subIndex."  It acts like the Microcode Sequencer 
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // const [instruction, setInstruction] = useState("ADD");
  // instructionIndex works like the CPU's Program Counter
  const [instructionIndex, setInstructionIndex] = useState(0);

  // const program = [
  //   "LD A,(0x2000)",
  //   "LD HL,0x2001",
  //   "ADD A,(HL)",
  //   "LD (0x2002),A"
  // ];
  const currentInstruction = PROGRAM[instructionIndex];

  const steps = [
    ...commonSteps,
    ...INSTRUCTION_MICROCODE[currentInstruction.opcode]
  ];

  const currentStep = steps[currentIndex];

 
  const [phase, setPhase] = useState(0);


  useEffect(() => {
    const timer = setInterval(() => {
      setPhase((p) => (p + 0.02) % 1);
    }, 20);

    return () => clearInterval(timer);
  }, []);

  const handleNextStep = () => {
    // Case 1: Still have micro-steps left in the current instruction
    if (currentIndex < steps.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } 
    // Case 2: Finished all micro-steps, move to the NEXT instruction
    else if (instructionIndex < PROGRAM.length - 1) {
      setInstructionIndex(prev => prev + 1);
      setCurrentIndex(1); // Reset micro-step counter for the new instruction
    } 
    // Case 3: Reached the end of the entire program
    else {
      console.log("Program finished executing.");
    }
  };
  const handleReset = () => {
    setInstructionIndex(0);
    setCurrentIndex(0);
  };
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr",
        gridTemplateRows: "1fr auto auto",
        gap: "10px",
        // height: "100vh",
        padding: "10px",
        boxSizing: "border-box",
      }}    >
      <div
        style={{
          border: "1px solid gray",
          padding: "10px",
        }}
      >

{/* Coordinate Reference

CPU: x=50..550

Other Registers : x=75
ALU             : x=200
ACC/IR/PC       : x=340
MDR/CU/MAR      : x=480
Memory          : x=700

*/}


      <CpuDiagram
        currentStep={currentStep}

      />
      <div
        style={{
          marginTop: "-25px",
          display: "flex",
          gap: "10px",
        }}
      >
          {/* <button
          onClick={() =>
            setCurrentIndex(Math.max(0, currentIndex - 1))
          }>
            Previous
          </button> */}

          <button
            // onClick={() =>
            //   setCurrentIndex(
            //     Math.min(steps.length - 1, currentIndex + 1)
            //   )}
            onClick={handleNextStep}
            >
           Next
          </button>

          <button onClick={handleReset}>
            Restart
          </button>
          <div>
            Current Instruction: {currentInstruction.instruction}
          </div>          
          {/* <label>Instruction:</label>
          <select
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
          >
            <option value="LOAD">LOAD</option>
            <option value="STORE">STORE</option>
            <option value="ADD">ADD</option>
            <option value="JMP">JMP</option>
            </select> */}
      </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: "10px",
      }}>

      <div
        style={{
          border: "1px solid gray",
          padding: "10px",
        }}
      >
      <h2>{currentStep.name}</h2>
      <p>{currentStep.description}</p>

      {currentStep.activeSignals && (
        <>
          <h3>Active Control Signals</h3>
          <ul>
            {currentStep.activeSignals.map((signal) => (
              <li key={signal} style={{color: getSignalColor(signal)}}>
                {signal}
              </li>
            ))}
          </ul>
        </>
      )}

      {currentStep.source && currentStep.destination && (
      <p>
        Data Transfer: {currentStep.source} → {currentStep.destination}
      </p>
      )}
      </div>
      <div style={{
          border: "1px solid gray",
          padding: "10px",
        }}
      >
      <h2>Legend</h2>
      {legend.map(([abbr, name]) => (
        <div key={abbr}>
          <strong>{abbr}</strong>: {name}
        </div>
      ))}
      </div>
    </div>
    </div>
  );
}

export default App;