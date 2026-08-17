export const executeSteps = {
  NOP: [
    {
      name: "Execute NOP",
      description: "No operation is performed.",
      activeBlocks: ["CU"],
      activeSignals: [],
    },
  ],

  ADD: [
    {
      name: "Execute ADD",
      description: "The ALU performs an addition using the accumulator.",
      activeBlocks: ["ACC", "ALU", "IR", "REGS"],
      activeConnections: [["ACC", "ALU"], ["IR", "ALU"], ["REGS","ALU"]],
      activeSignals: ["ACC_OUT", "ALU_OP"],
    },

    {
      name: "Store Result",
      description: "The ALU result is written back into the accumulator.",
      source: "ALU",
      destination: "ACC",
      activeBlocks: ["ALU", "ACC"],
      activeConnections: [["ALU", "ACC"]],
      activeSignals: ["ACC_IN"],
    },
  ],

  LOAD: [
    {
      name: "Load Data",
      description: "Read data from memory into MDR.",
      source: "Memory",
      destination: "MDR",
      activeBlocks: ["Memory", "MDR"],
      activeConnections: [["Memory", "MDR"]],
      activeSignals: ["MEM_READ", "MEM_OUT", "MDR_IN"],
    },

    {
      name: "Load ACC",
      description: "Transfer the MDR contents into the accumulator.",
      source: "MDR",
      destination: "ACC",
      activeBlocks: ["MDR", "ACC"],
      activeConnections: [["MDR", "ACC"]],
      activeSignals: ["MDR_OUT", "ACC_IN"],
    },
  ],

  STORE: [
    {
      name: "Copy ACC",
      description: "Transfer accumulator contents into MDR.",
      source: "ACC",
      destination: "MDR",
      activeBlocks: ["ACC", "MDR"],
      activeConnections: [["ACC", "MDR"]],
      activeSignals: ["ACC_OUT", "MDR_IN"],
    },

    {
      name: "Write Memory",
      description: "Store the MDR contents into memory.",
      source: "MDR",
      destination: "Memory",
      activeBlocks: ["MDR", "Memory"],
      activeConnections: [["MDR", "Memory"]],
      activeSignals: ["MDR_OUT", "MEM_WRITE"],
    },
  ],

  JMP: [
    {
      name: "Load PC",
      description: "Load the target address from the IR into the Program Counter.",
      source: "IR",
      destination: "PC",
      activeBlocks: ["IR", "PC"],
      activeConnections: [["IR", "PC"]],
      activeSignals: ["IR_OUT", "PC_IN"],
    },
  ],
};

export const commonSteps = [
  {
    name: "Idle",
    description: "Click 'Next' to start walking through each sub-stage of the CPU instruction cycle",
    activeBlocks: [],
    activeConnections: [],
    activeSignals: [],
  },
  {
    name: "Fetch 1",
    description: "Copy the Program Counter (PC) to the Memory Address Register (MAR).",
    activeBlocks: ["PC", "MAR"],
    activeConnections: [["PC", "MAR"]],
    activeSignals: ["PC_OUT", "MAR_IN"],
    source: "PC",
    destination: "MAR",
  },
  {
    name: "Fetch 2",
    description: "Place the MAR contents on the Address Bus and initiate a memory read.",
    activeBlocks: ["MAR", "MEM"],
    activeConnections: [["MAR", "MEM"]],
    activeSignals: ["MAR_OUT", "MEM_OUT"],
    source: "MAR",
    destination: "MEM",
  },
  {
    name: "Fetch 3",
    description: "Memory places the instruction on the Data Bus and loads the MDR.",
    activeBlocks: ["MEM", "MDR"],
    activeConnections: [["MEM", "MDR"]],
    activeSignals: ["MEM_OUT", "MDR_IN"],
    source: "MEM",
    destination: "MDR",
  },
  {
    name: "Fetch 4",
    description: "Copy the MDR contents into the Instruction Register (IR).",
    activeBlocks: ["MDR", "IR"],
    activeConnections: [["MDR", "IR"]],
    activeSignals: ["MDR_OUT", "IR_IN"],
    source: "MDR",
    destination: "IR",
  },
  {
    name: "Fetch 5",
    description: "Increment the Program Counter (PC).",
    activeBlocks: ["PC"],
    activeSignals: ["PC_INC"],
  },
  {
    name: "Decode",
    description: "The Control Unit decodes the instruction because the next steps are conditional.",
    activeBlocks: ["IR", "Control Unit"],
    activeConnections: [["IR", "CU"]],
    activeSignals: ["IR_OUT"],
    source: "IR",
    destination: "CU",
  },
//   {
//     name: "Execute",
//     description: "Perform the operation specified by the instruction.",
//     activeBlocks: ["ALU"],
//     activeSignals: ["ALU_OP"]
//   },
];

// Microcode definitions indexed by Instruction / Opcode pattern
export const INSTRUCTION_MICROCODE = {
  "LD A, (nn)": [
    {
      name: "Address Setup",
      description: "Transfer target address from IR to MAR.",
      activeBlocks: ["IR", "MAR"],
      activeConnections: [["IR", "MAR"]],
      activeSignals: ["IR_OUT", "MAR_IN"],
      source: "IR",
      destination: "MAR",
//   readEnable: ["IR_OPERAND"],
    //   writeEnable: ["MAR"],
    //   controlSignals: ["BUS_CONNECT"]
    },
    {
        name: "Data Fetch 1",
        description: "Place the MAR contents on the Address Bus and initiate a memory read.",
        activeBlocks: ["MAR", "MEM"],
        activeConnections: [["MAR", "MEM"]],
        activeSignals: ["MAR_OUT", "MEM_OUT"],
        source: "MAR",
        destination: "MEM",
    },
    {
        name: "Data Fetch 2",
        description: "Load the Operand Data into MDR.",
        activeBlocks: ["MEM", "MDR"],
        activeConnections: [["MEM", "MDR"]],
        activeSignals: ["MEM_OUT", "MDR_IN"],
        source: "MEM",
        destination: "MDR",
    },
    {
      name: "Register Transfer",
      description: "Transfer fetched byte from MDR to Accumulator A.",
      activeBlocks: ["MDR", "ACC"],
      activeConnections: [["MDR", "ACC"]],
      activeSignals: ["MDR_OUT","ACC_IN"],
      source: "MDR",
      destination: "ACC",
    }
   ],

  "LD HL, nn": [
    {
      name: "Immediate Load",
      description: "Load immediate 16-bit address into HL register pair.",
      activeBlocks: ["IR", "HL"],
      activeConnections: [["IR", "HL"]],
      activeSignals: ["IR_OUT", "HL_IN"],
      source: "IR",
      destination: "HL"
    }
  ],

  "ADD A, (HL)": [
    {
      name: "Address Setup",
      description: "Drive MAR with memory pointer stored in HL.",
      activeBlocks: ["HL","MAR"],
      activeConnections: [["HL", "MAR"]],
      activeSignals: ["HL_OUT", "MAR_IN"],
      source: "HL",
      destination: "MAR"
    },
    {
        name: "Data Fetch 1",
        description: "Place the MAR contents on the Address Bus and initiate a memory read.",
        activeBlocks: ["MAR", "MEM"],
        activeConnections: [["MAR", "MEM"]],
        activeSignals: ["MAR_OUT", "MEM_OUT"],
        source: "MAR",
        destination: "MEM",
    },
    {
        name: "Data Fetch 2",
        description: "Load the Operand Data into MDR.",
        activeBlocks: ["MEM", "MDR"],
        activeConnections: [["MEM", "MDR"]],
        activeSignals: ["MEM_OUT", "MDR_IN"],
        source: "MEM",
        destination: "MDR",
    },
    {
      name: "ALU Execution",
      description: "Feed A and MDR into ALU, compute sum, and latch into Accumulator ACC.",
      activeBlocks: ["ACC", "MDR", "ALU"],
      activeConnections: [["ALU", "ACC"],["ACC", "ALU"],["MDR","ALU"]],
      activeSignals: ["MDR_OUT", "ACC_IN", "ACC_OUT", "ALU"]
    }
   ],

//   "LD (nn), A": [
//     {
//       name: "Memory Write Setup",
//       description: "Copy target address to MAR and Accumulator contents to MDR.",
//       readEnable: ["IR_OPERAND", "A"],
//       writeEnable: ["MAR", "MDR"],
//       controlSignals: ["BUS_CONNECT"]
//     },
//     {
//       name: "Memory Write",
//       description: "Assert write signal to transfer MDR value to RAM address in MAR.",
//       readEnable: ["MDR"],
//       writeEnable: ["RAM"],
//       controlSignals: ["MEM_WRITE"]
//     }
//   ],

//   "HALT": [
//     {
//       name: "Control",
//       description: "Assert HALT signal to disable the CPU clock generator.",
//       readEnable: [],
//       writeEnable: [],
//       controlSignals: ["CPU_HALT"]
//     }
//   ]
};

export const PROGRAM = [
  {
    instruction: "LD A, (0x2000)",
    opcode: "LD A, (nn)",
    operand: "0x2000"
  },
  {
    instruction: "LD HL, 0x2001",
    opcode: "LD HL, nn",
    operand: "0x2001"
  },
  {
    instruction: "ADD A, (HL)",
    opcode: "ADD A, (HL)",
    operand: null
  },
//   {
//     instruction: "LD (0x2002), A",
//     opcode: "LD (nn), A",
//     operand: "0x2002"
//   },
//   {
//     instruction: "HALT",
//     opcode: "HALT",
//     operand: null
//   }
];

