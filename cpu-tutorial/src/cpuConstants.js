export const COLORS = {
    minesDarkBlue: "#21314D",
    minesLightBlue: "#92A2BD",
    minesPaleBlue: "#CFDCE9",
    goldenTech: "#F1B91A",
    environmentGreen: "#80C342",
    energyYellow: "#F0F600",
    white: "#FFFFFF",
    ALU: "#DDB556",

    active: "#F0F600",
    inactive: "#FFFFFF",
    writeEnable: "#FF8C00",
    readEnable: "#1E90FF",
    inactiveControl: "#80C342"
};

export const components = {
    ACC: { x: 340, y: 110, w: 90, h: 40, label: "ACC"},
    IR:  { x: 360, y: 200, w: 100, h: 40, label: "IR"},
    HL:  { x: 360, y: 260, w: 100, h: 40, label: "H&L"},
    PC:  { x: 360, y: 320, w: 100, h: 40, label: "PC"},
    MDR: { x: 530, y: 110, w: 100, h: 50, label: "MDR"},
    CU:  { x: 520, y: 190, w: 110, h: 90, label: "Control Unit", fill: COLORS.environmentGreen},
    MAR: { x: 520, y: 310, w: 110, h: 50, label: "MAR"},
    MEM: { x: 760, y: 110,  w: 110, h: 250, label: "Memory", fill: COLORS.minesPaleBlue},

    ALU: { x: 205, y: 110, w: 110, h: 250, label: "ALU", fill: COLORS.ALU},
    REGS: {x: 60, y: 110, w: 110, h: 250, label: "Other \n Registers"},

    MUX: {x:450,y:130,w:0,h:0,label:""}

};

export const controlConnections = [
    { from: "CU", to: "PC_INC", x1: 520, y1: 280, x2: 460, y2: 320, layer: "low" },
    { from: "CU", to: "PC_OUT", x1: 530, y1: 280, x2: 460, y2: 327, layer: "low" },
    { from: "CU", to: "MAR_IN", x1: 572, y1: 280, x2: 572, y2: 310, layer: "low" },
    { from: "CU", to: "MAR_OUT", x1: 578, y1: 280, x2: 578, y2: 310, layer: "low" },
    { from: "CU", to: "MDR_IN", x1: 572, y1: 190, x2: 572, y2: 160, layer: "low"},
    { from: "CU", to: "MDR_OUT", x1: 578, y1: 190, x2: 578, y2: 160, layer: "low"},
    { from: "CU", to: "IR_IN", x1: 520, y1: 225, x2: 460, y2: 225, layer: "low" },
    { from: "CU", to: "IR_OUT", x1: 520, y1: 215, x2: 460, y2: 215, layer: "low" },
    { from: "CU", to: "HL_IN", x1: 520, y1: 272, x2: 460, y2: 287, layer: "low" },
    { from: "CU", to: "HL_OUT", x1: 520, y1: 265, x2: 460, y2: 272, layer: "low" },
    { from: "CU", to: "ACC_IN", x1: 520, y1: 198, x2: 415, y2: 150, layer: "low"},
    { from: "CU", to: "ACC_OUT", x1: 520, y1: 190, x2: 430, y2: 150, layer: "low"},
    { from: "CU", to: "ALU", x1: 520, y1: 250, x2: 315, y2: 250, layer: "low"},
    // I tried making this route squarely around IR, but actually, maybe it can just be straight.
    // {from: "CU", to: "ALU", path: [
    //     {x: 525, y: 245},
    //     {x: 480, y: 245},
    //     {x: 480, y: 245},
    //     {x: 315, y: 245}
    // ]}, 
    { from: "CU", to: "MEM_OUT", x1: 630, y1: 232, x2: 760, y2: 232, layer: "high" },
    { from: "CU", to: "MEM_IN", x1: 630, y1: 238, x2: 760, y2: 238, layer: "high" },
];

export const connections = [
    // {
    //   from: "IR",
    //   to: "CU",
    //   x1: 470,
    //   y1: 235,
    //   x2: 520,
    //   y2: 235,
    //   path: [{x:470, y:235}, {x:520, y:235}]
    // },
    {from: "MAR", to: "MEM", fromSide: "right", toSide: "left", layer: "high", anchor: "MAR"},
    {from: "MDR", to: "MEM", fromSide: "right", toSide: "left", layer: "high", anchor: "MDR"},
    {from: "MEM", to: "MDR", fromSide: "left", toSide: "right", layer: "high", anchor: "MDR"},
    {from: "ACC", to: "ALU", fromSide: "left", toSide: "right", layer: "low", anchor: "ACC"},
    {from: "PC", to: "MAR", layer: "low", anchor: "PC"},
    {from: "IR", to: "CU", layer: "low", anchor: "IR"},
    {from: "IR", to: "ALU", layer: "low", anchor: "IR"},
    // {from: "ACC", to: "MDR", layer: "low", anchor: "ACC"},
    // {from: "MDR", to: "ACC", layer: "low", anchor: "ACC"},
//    {
//         from: "PC",
//         to: "MAR",
//         // x1: 470,
//         y1: 335,
//         x2: 520,
//         y2: 335,
//         path: [{x:270, y:335}, {x:620, y:335}],
//         layer: "low"
//         },
    // {
    //     from: "IR",
    //     to: "ALU",
    //     // x1: 315,
    //     // y1: 235,
    //     // x2: 360,
    //     // y2: 235,
    //     layer: "low",
    //     anchor: "IR"
    // },
    // {
    //     from: "REGS",
    //     to: "ALU",
    //     // x1: 170,
    //     // y1: 185,
    //     // x2: 205,
    //     // y2: 185,
    //     layer: "low"
    // },
    // {
    //     from: "ACC",
    //     to: "ALU",
    //     x1: 315,
    //     y1: 135,
    //     x2: 360,
    //     y2: 135,
    // },
    {
        from: "MDR",
        to: "IR",
        // x1: 520,
        // y1: 150,
        // x2: 470,
        // y2: 220,
        path: [
            {x:530, y:135},
            {x:500, y:135},
            {x:500, y:220},
            {x:450, y:220}],
        layer: "low"
    },
    {
        from: "MDR",
        to: "ALU",
        // x1: 520,
        // y1: 150,
        // x2: 470,
        // y2: 220,
        path: [
            {x:530, y:135},
            {x:500, y:135},
            {x:500, y:185},
            {x:300, y:185}],
        layer: "low"
    },
    {
        from: "HL",
        to: "MAR",
        path: [
            {x:450, y:280},
            {x:500, y:280},
            {x:500, y:340},
            {x:530, y:340}
        ],
        layer: "low"
    },
    {
        from: "IR",
        to: "MAR",
        path: [
            {x:450, y:220},
            {x:500, y:220},
            {x:500, y:340},
            {x:530, y:340}
        ],
        layer: "low"
    },
    {
        from: "MDR",
        to: "HL",
        path: [{x:530, y:135},
            {x:500, y:135},
            {x:500, y:280},
            {x:450, y:280}],
        layer: "low"
    },
    {
        from: "IR",
        to: "HL",
        path: [{x:450, y:220},
                {x:500, y:220},
                {x:500, y:280},
                {x:450, y:280}],
        layer: "low"
    },
    {
        from: "ALU",
        to: "ACC",
        path: [
                {x:315, y:170},
                {x:480, y:170},
                {x:480, y:148},
                {x:470, y:148},
                {x:445, y:130},
                {x:430, y:130},
        ],
        layer: "high"
    },
    {
        from: "MDR", to: "ACC",
        path: [
                {x:530, y:135},
                {x:500, y:135},
                {x:500, y:112},
                {x:470, y:112},
                {x:445, y:130},
                {x:430, y:130}
        ],
        layer: "high"
    },
    {
        from: "ACC", to: "MDR",
        path: [
                {x:430, y:130},
                {x:445, y:130},
                {x:470, y:112},
                {x:500, y:112},
                {x:500, y:135},
                {x:530, y:135}
        ],
        layer: "high"
    },
        {
        from: "MUX",
        to: "ACC",
        path: [
                {x:430, y:130},
                {x:445, y:130},
        ],
        layer: "low"
    }

    // {
    //   from: "MDR",
    //   to: "ACC",
    //   x1: 470,
    //   y1: 135,
    //   x2: 520,
    //   y2: 135,
    // },
];

export const legend = [
  ["PC", "Program Counter"],
  ["IR", "Instruction Register"],
  ["MAR", "Memory Address Register"],
  ["MDR", "Memory Data Register"],
  ["ACC", "Accumulator"],
  ["ALU", "Arithmetic Logic Unit"],
  ["H&L", "Pointer to a Data Address"]
];