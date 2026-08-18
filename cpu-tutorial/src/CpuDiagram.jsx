import { useState, useEffect, useMemo} from "react";
import {
  COLORS,
  components,
  connections,
  controlConnections,
} from "./cpuConstants";

export function getSignalColor(signal) {
return (
    (signal.endsWith("_OUT") ? COLORS.readEnable : 
    ((signal.endsWith("_IN") || signal.endsWith("_INC"))  ? COLORS.writeEnable :
        COLORS.inactiveControl)));}

export default function CpuDiagram({currentStep}) {

  const [phase, setPhase] = useState(0);
    useEffect(() => {
    const timer = setInterval(() => {
      setPhase((p) => (p + 0.02) % 1);
    }, 20);

    return () => clearInterval(timer);
  }, []);

    const activeConnection = connections.find(
        ({from, to}) =>
        from === currentStep.source &&
        to === currentStep.destination
    );
   function getEndpoints(conn) {
    // const left = components[from];
    // const right = components[to];

    // console.log("left =", left);
    // console.log("right =", right);

    const fromComp = components[conn.from];
    const toComp = components[conn.to];
    let x1, x2, y1, y2;
    if ("anchor" in conn){
        const anchorComp = components[conn.anchor];
        y1 = anchorComp.y + anchorComp.h / 2;
        y2 = y1;
    } else {
        y1 = fromComp.y + fromComp.h / 2;
        y2 = toComp.y + toComp.h / 2; 
    }
    if ( conn.fromSide === "left"){
        x1 = fromComp.x;
    } else if ( conn.fromSide === "right"){
        x1 = fromComp.x + fromComp.w;
    } else 
        x1 = fromComp.x + fromComp.w / 2;

    if ( conn.toSide === "left"){
        x2 = toComp.x;
    } else if ( conn.toSide === "right" ){
        x2 = toComp.x + toComp.w;
    } else {
        x2 = toComp.x + toComp.w / 2;
    }

    return [{x:x1,y:y1},{x:x2,y:y2}];}
    
    const endpoints =
        activeConnection &&
        getEndpoints(activeConnection)

    const polylinePoints =
        activeConnection &&
        activeConnection.path
        
  function isActive(blockName) {
    return currentStep.activeBlocks.includes(blockName);
  }
  function isConnectionActive(conn) {
    if (!currentStep.activeConnections) {
      return false;
    }
    return currentStep.activeConnections.some(
      ([from, to]) =>
        from === conn.from && to === conn.to
    );}

  function isControlConnectionActive(conn) {
    if (!currentStep.activeSignals) {
      return false;
    }
    return currentStep.activeSignals.some((signal) =>
      signal.startsWith(conn.to)
    );}
  function getSignalColor(signal) {
    return (
        (signal.endsWith("_OUT") ? COLORS.readEnable : 
        ((signal.endsWith("_IN") || signal.endsWith("_INC"))  ? COLORS.writeEnable :
            COLORS.inactiveControl)));}
  function isTransfer(source, destination) {
    return (
      currentStep.source === source &&
      currentStep.destination === destination
    );}
  
  
function RenderConnection({conn, phase}){
    
    // console.log('Conn received:', conn, 'Path:', conn?.path);
    
    const path = useMemo(() => {
        return conn?.path || getEndpoints(conn) || [];
    }, [conn]);
    
    //console.log ('Path:', path);
    const active = isConnectionActive(conn);

    // 1. Format points string for polyline
    const pointsString = useMemo(() => {
        if (!path.length) return '';
        return path.map((p) => `${p.x},${p.y}`).join(' ');
    }, [path]);

    // 2. Calculate pulse position only when active
    const pulsePos = useMemo(() => {
        if (!active || path.length < 2) return null;
        return getPointAtPolylinePhase(path, phase);
    }, [path, phase, active]);

    // Early return if no valid path exists
    if (!path.length) return null;
    
       return(
            <g>
            <polyline
                points={pointsString}
                fill="none"
                stroke={active
                    ? COLORS.active
                    : COLORS.minesLightBlue
                }
                strokeWidth={
                isConnectionActive(conn)
                    ? 6
                    : 3
                }
            /> 
{/* Pulse Circle (Active Only) */}
      {active && pulsePos && (
        <circle
          cx={pulsePos.x}
          cy={pulsePos.y}
          r="8"
          fill={COLORS.active}
        />
        )}
        </g>
        
        );

        // return(
        //     <line
        //         // key={index}
        //         // x1={conn.x1}
        //         // y1={conn.y1}
        //         // x2={conn.x2}
        //         // y2={conn.y2}
        //         // x1={components[conn.from].x + components[conn.from].w /2}
        //         // y1={components[conn.from].y + components[conn.from].h /2}
        //         // x2={components[conn.to].x + components[conn.to].w /2}
        //         // y2={components[conn.to].y + components[conn.to].h /2}
        //         x1={p.x1}
        //         y1={p.y1}
        //         x2={p.x2}
        //         y2={p.y2}
        //         stroke={
        //         isConnectionActive(conn)
        //             ? COLORS.active
        //             : COLORS.minesLightBlue
        //         }
        //         strokeWidth={
        //         isConnectionActive(conn)
        //             ? 6
        //             : 3
        //         }
        //     />);    
        }
  function RenderControlConnection(conn, index){
            if(conn.path){
                return(
                    <polyline
                        key={`ctrl-${index}`}
                        points={conn.path
                            .map(p => `${p.x},${p.y}`)
                            .join(" ")}
                        fill="none"
                        stroke={isControlConnectionActive(conn) ? getSignalColor(conn.to) : COLORS.environmentGreen}
                        strokeWidth={isControlConnectionActive(conn) ? 3 : 1}
                        opacity={isControlConnectionActive(conn) ? 1.0 : 0.4}
                    />);}
                return(
                    <line
                        key={`ctrl-${index}`}
                        x1={conn.x1}
                        y1={conn.y1}
                        x2={conn.x2}
                        y2={conn.y2}
                        stroke={isControlConnectionActive(conn) ? getSignalColor(conn.to) : COLORS.environmentGreen}
                        strokeWidth={isControlConnectionActive(conn) ? 3 : 1}
                        opacity={isControlConnectionActive(conn) ? 1.0 : 0.4}
                    />);
            }

    function getPointAtPolylinePhase(points, phase) {
    if (!points || points.length === 0) return { x: 0, y: 0 };
    if (points.length === 1) return points[0];

    // 1. Calculate lengths of each segment and total polyline length
    const segmentLengths = [];
    let totalLength = 0;

    for (let i = 0; i < points.length - 1; i++) {
        const dx = points[i + 1].x - points[i].x;
        const dy = points[i + 1].y - points[i].y;
        const dist = Math.hypot(dx, dy);
        segmentLengths.push(dist);
        totalLength += dist;
    }

    if (totalLength === 0) return points[0];

    // 2. Find target distance based on phase
    const targetDist = phase * totalLength;

    // 3. Find which segment targetDist falls into
    let accumulated = 0;
    for (let i = 0; i < segmentLengths.length; i++) {
        const segLen = segmentLengths[i];

        if (accumulated + segLen >= targetDist || i === segmentLengths.length - 1) {
        const segmentPhase = segLen === 0 ? 0 : (targetDist - accumulated) / segLen;
        const p1 = points[i];
        const p2 = points[i + 1];

        return {
            x: p1.x + segmentPhase * (p2.x - p1.x),
            y: p1.y + segmentPhase * (p2.y - p1.y),
        };
        }
        accumulated += segLen;
    }

    return points[points.length - 1];
    }


//   function getSignalClass(signal) {
//     return (
//         (signal.endsWith("_OUT") ? "readEnable" : 
//         (signal.endsWith("_IN") ? "writeEnable" :
//             "inactiveControl")));}
    return (
    <svg 
        width="100%" 
        height="100%" 
        viewBox="25 0 880 425" 
        // style={{backgroundColor: "#ffeeee"}}
    >
    <defs>
    <marker
        id="arrowhead"
        markerWidth="4"
        markerHeight="5"
        refX="2"
        refY="2"
        orient="auto-start-reverse"
    >
        <polygon
        points="1.4 1.1, 2.8 2.0, 1.4 2.9"
        fill={COLORS.minesLightBlue}
        />
    </marker>
    </defs>

        {/* CPU */}
        <rect
        x="40"
        y="90"
        width="610"
        height="290"
        fill={COLORS.minesDarkBlue}
        stroke="black"
        />

        <text x="360" y="80" textAnchor="middle" fontSize="20">
        CPU
        </text>

        {/* Control Unit */}
        {/* <rect
        x="520"
        y="210"
        width="110"
        height="50"
        fill={
            currentStep.activeBlocks.includes("Control Unit")
            ? "#FFD54F"
            : "#DDEEFF"
        }
        stroke="black"
        />

        <text x="200" y="145" textAnchor="middle">
        Control Unit
        </text> */}

        {/* ALU */}
        {/* <rect
        x="205"
        y="110"
        width="110"
        height="250"
        fill={
            currentStep.activeBlocks.includes("ALU")
            ? COLORS.active
            : "#DDB556"
        }
        stroke="black"
        /> */}

        {/* <text x="260" y="245" textAnchor="middle">
        ALU
        </text> */}

        {/* Memory Background*/}
        <rect
            x="740"
            y="90"
            width="150"
            height="290"
            fill={COLORS.minesDarkBlue}
            stroke="black"
        />
        
        {/* Draw the Low Layer Control Connections*/}
        {controlConnections
            .filter(conn => conn.layer === "low")
            .map(RenderControlConnection)}

        {/* Draw the Low Layer Data Connections*/}
        {connections
            .filter(conn => conn.layer === "low")
            .map((conn, index) => (
                <RenderConnection
                    key={conn.id || `conn-${index}`}
                    conn={conn}
                    phase={phase}
                />
            ))}


        {/* Draw the Components*/}
        {Object.entries(components).map(([id, comp]) => (
        <g key={id}>
            <rect
            x={comp.x}
            y={comp.y}
            width={comp.w}
            height={comp.h}
            fill={
                isActive(id)
                ? COLORS.active
                : (comp.fill ?? COLORS.white)
            }
            stroke="black"
            />

            <text
            x={comp.x + comp.w / 2}
            y={comp.y + comp.h / 2 + 5}
            textAnchor="middle"
            >
            {comp.label.split("\n").map((line, i) => (
                <tspan
                key={i}
                x={comp.x + comp.w / 2}
                dy={i === 0 ? 0 : "1.2em"}
                >
                {line}
                </tspan>
            ))}
            </text>
        </g>
        ))}

        {/* ACC Input Mux */}
        <polygon
            points ="445,120 470,105 470,120 455,130 470,140 470,155 445,140"
            fill={COLORS.minesLightBlue} />

        {/* Data Bus */}
        <line
            x1="630"
            y1="135"
            x2="760"
            y2="135"
            stroke={COLORS.minesLightBlue}
            strokeWidth="20"
            markerEnd="url(#arrowhead)"
            markerStart="url(#arrowhead)"
        />

        {/* Control Bus */}
        <line
            x1="630"
            y1="235"
            x2="760"
            y2="235"
            stroke={COLORS.minesLightBlue}
            strokeWidth="20"
            markerEnd="url(#arrowhead)"
        />

        {/* Address Bus */}
        <line
            x1="630"
            y1="335"
            x2="760"
            y2="335"
            stroke={COLORS.minesLightBlue}
            strokeWidth="20"
            markerEnd="url(#arrowhead)"
        />
        {/* Draw the high Layer Control Connections*/}
        {controlConnections
            .filter(conn => conn.layer === "high")
            .map(RenderControlConnection)}

        {/* Draw the high Layer Data Connections*/}
        {connections
            .filter(conn => conn.layer === "high")
            .map((conn, index) => (
                <RenderConnection
                    key={conn.id || `conn-${index}`}
                    conn={conn}
                    phase={phase}
                />
            ))}
        
        <text x="695" y="137" textAnchor="middle" dominantBaseline="middle">
            Data Bus
        </text>
        <text x="695" y="237" textAnchor="middle" dominantBaseline="middle">
            Control Bus
        </text>
        <text x="695" y="337" textAnchor="middle" dominantBaseline="middle">
            Address Bus
        </text>

        {/* Animate a moving pulse */}
        {/* {endpoints && (
            <circle
            cx={
                endpoints.x1 +
                phase *
                (endpoints.x2 -
                endpoints.x1)
            }
            cy={
                endpoints.y1 +
                phase *
                (endpoints.y2 -
                endpoints.y1)
            }
            r="8"
            fill={COLORS.active}
            />
        )} */}

        {/* {polylinePoints && polylinePoints.length > 0 && (() => {
        const currentPos = getPointAtPolylinePhase(polylinePoints, phase);

        return (
            <circle
            cx={currentPos.x}
            cy={currentPos.y}
            r="8"
            fill={COLORS.active}
            />
        );
        }
        )()} */}

    {/* {activePaths.map((path) => (
        <PolylinePulse
          key={path.id}
          points={path.points}
          phase={path.phase}
        />
      ))}         */}

    </svg>
    );
}