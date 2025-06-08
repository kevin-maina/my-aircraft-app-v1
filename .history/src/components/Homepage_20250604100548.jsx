import React, { useState } from 'react';
import {
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Scatter,
  ReferenceLine,
  ReferenceDot,
  Label,
  Legend,
  Customized
} from 'recharts';


const isPositiveNumber = (val) => /^\d*\.?\d*$/.test(String(val).trim());

const Homepage = () => {
  const [activeTab, setActiveTab] = useState('Sheet');
  const TabButton = ({ label, isActive, onClick }) => (
    <button
      onClick={() => onClick(label)}
      className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
        isActive
          ? 'bg-blue-500 text-white'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      {label}
    </button>
  );
  
  // Weight and Balance form state

const WeightBalanceTable = () => {
  const [basicEmpty, setBasicEmpty] = useState({ weight: '', arm: '', moment: 0 });
  const [pilotPax, setPilotPax] = useState({ weight: '', arm: 0.99, moment: 0 });
  const [fuel, setFuel] = useState({ weight: '', arm: 1.07, moment: 0 });
  const [baggage, setBaggage] = useState({ weight: '', arm: 1.5, moment: 0 });
  const [fuelBurn, setFuelBurn] = useState({ weight: '', arm: 1.07, moment: 0 });

  const MAX_FUEL = 95;
  const MAX_BAGGAGE = 54;

  const calculateMoment = (weight, arm) => parseFloat((weight * arm).toFixed(2));

  const handleInputChange = (e, state, setState, isArmEditable = true, maxLimit = null) => {
    const { name, value } = e.target;
    if (value === '' || isPositiveNumber(value)) {
      let numericValue = parseFloat(value);
      if (maxLimit !== null && numericValue > maxLimit) {
        numericValue = maxLimit;
      }
      const updated = {
        ...state,
        [name]: value === '' ? '' : numericValue.toString(),
      };
      const weight = parseFloat(updated.weight) || 0;
      const arm = isArmEditable ? parseFloat(updated.arm) || 0 : state.arm;
      updated.moment = calculateMoment(weight, arm);
      setState(updated);
    }
  };

  const totalWeight =
    (parseFloat(basicEmpty.weight) || 0) +
    (parseFloat(pilotPax.weight) || 0) +
    (parseFloat(fuel.weight) || 0) +
    (parseFloat(baggage.weight) || 0);

  const totalMoment =
    (basicEmpty.moment || 0) + (pilotPax.moment || 0) + (fuel.moment || 0) + (baggage.moment || 0);

  const takeoffCOG = totalWeight > 0 ? (totalMoment / totalWeight).toFixed(2) : '0';

  const fuelBurnWeight = parseFloat(fuelBurn.weight) || 0;
  const fuelBurnMoment = calculateMoment(fuelBurnWeight, fuelBurn.arm);
  const landingWeight = totalWeight - fuelBurnWeight;
  const landingMoment = totalMoment - fuelBurnMoment;
  const landingCOG = landingWeight > 0 ? (landingMoment / landingWeight).toFixed(2) : '0';


  const takeoffPoint = { moment: totalMoment, weight: totalWeight, name: `Takeoff (${takeoffCOG})` };
  const landingPoint = { moment: landingMoment, weight: landingWeight, name: 'Landing (${landingCOG})' };


const envelopePoints = [

  { moment: 440, weight: 550 }, // Start
  { moment: 510, weight: 550 }, // Lower bound end
  { moment: 700, weight: 750 }, // Upper right
  { moment: 630, weight: 750 }, // Upper left
  { moment: 440, weight: 550 },
];

function drawEnvelopeArea({ xAxisMap, yAxisMap, width, height, viewBox, offset }) {
  if (!xAxisMap || !yAxisMap) return null;
  const yScale = yAxisMap[0].scale;
  const xScale = xAxisMap[0].scale;
  

  const points = envelopePoints
    .map(p => ${xScale(p.moment)},${yScale(p.weight)})
    .join(' ');

  return (
    <polygon
      points={points}
      fill="rgba(136, 132, 216, 0.3)"
      stroke="#8884d8"
      strokeWidth={2}
    />
  );}

  function isPointInPolygon(point, polygon) {
  let { moment: x, weight: y } = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    let xi = polygon[i].moment, yi = polygon[i].weight;
    let xj = polygon[j].moment, yj = polygon[j].weight;

    const intersect =
      yi > y !== yj > y &&
      x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
}

const isTakeoffOutOfEnvelope = !isPointInPolygon(takeoffPoint, envelopePoints);
const isLandingOutOfEnvelope = !isPointInPolygon(landingPoint, envelopePoints);

const weightData = [
  { name: "Pilot & Pax", weight: parseFloat(pilotPax.weight) || 0, arm: pilotPax.arm },
  { name: "Fuel", weight: parseFloat(fuel.weight) || 0, arm: fuel.arm },
  { name: "Baggage", weight: parseFloat(baggage.weight) || 0, arm: baggage.arm }
];

const pilotRow = weightData.find(row => row.name === "Pilot & Pax");
const fuelRow = weightData.find(row => row.name === "Fuel");
const baggageRow = weightData.find(row => row.name === "Baggage");

const pilotWeight = pilotRow?.weight || 0;
const pilotMoment = pilotWeight * (pilotRow?.arm || 0);

const fuelWeight = fuelRow?.weight || 0;
const fuelMoment = fuelWeight * (fuelRow?.arm || 0);

const baggageWeight = baggageRow?.weight || 0;
const baggageMoment = baggageWeight * (baggageRow?.arm || 0);

const majorTicks = [0, 20, 40, 60, 80, 100, 120, 140, 160, 180];
const minorTicks = Array.from({ length: 181 }, (_, i) => i); // [0,1,2,...,180]


  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen font-sans max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-700">Weight and Balance Sheet</h2>
      <table className="w-full border-collapse border border-gray-300 shadow-sm">
        <thead>
          <tr className="bg-indigo-100 text-indigo-700 text-left">
            <th className="border border-gray-300 px-4 py-3">C-150</th>
            <th className="border border-gray-300 px-4 py-3">WEIGHT (KGS)</th>
            <th className="border border-gray-300 px-4 py-3">ARM (MTS.)</th>
            <th className="border border-gray-300 px-4 py-3">MOMENT (MTS.KG)</th>
          </tr>
        </thead>
        <tbody>
          {/* BASIC EMPTY WEIGHT */}
          <tr className="border-b border-gray-200 hover:bg-gray-100">
            <td className="px-4 py-3 font-semibold">BASIC EMPTY WEIGHT</td>
            <td className="px-4 py-2">
              <input
                type="text"
                name="weight"
                value={basicEmpty.weight}
                onChange={(e) => handleInputChange(e, basicEmpty, setBasicEmpty)}
                className="border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Basic Empty Weight"
              />
            </td>
            <td className="px-4 py-2">
              <input
                type="number"
                name="arm"
                value={basicEmpty.arm}
                onChange={(e) => handleInputChange(e, basicEmpty, setBasicEmpty)}
                className="border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Basic Empty Arm"
              />
            </td>
            <td className="px-4 py-2">
              <input
                type="text"
                value={basicEmpty.moment.toFixed(2)}
                readOnly
                className="border border-gray-300 rounded px-2 py-1 w-full bg-gray-100 cursor-not-allowed"
                aria-label="Basic Empty Moment"
              />
            </td>
          </tr>

          {/* PILOT & PAX */}
          <tr className="border-b border-gray-200 hover:bg-gray-100">
            <td className="px-4 py-3 font-semibold">PILOT & PAX</td>
            <td className="px-4 py-2">
              <input
                type="text"
                name="weight"
                value={pilotPax.weight}
                onChange={(e) => handleInputChange(e, pilotPax, setPilotPax, false)}
                className="border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Pilot and Passenger Weight"
              />
            </td>
            <td className="px-4 py-2">
              <input
                type="text"
                value={pilotPax.arm}
                readOnly
                className="border border-gray-300 rounded px-2 py-1 w-full bg-gray-100 cursor-not-allowed"
                aria-label="Pilot and Passenger Arm"
              />
            </td>
            <td className="px-4 py-2">
              <input
                type="text"
                value={pilotPax.moment.toFixed(2)}
                readOnly
                className="border border-gray-300 rounded px-2 py-1 w-full bg-gray-100 cursor-not-allowed"
                aria-label="Pilot and Passenger Moment"
              />
            </td>
          </tr>

          {/* FUEL */}
          <tr className="border-b border-gray-200 hover:bg-gray-100">
            <td className="px-4 py-3 font-semibold">
              FUEL (MAX {MAX_FUEL} KGS)
            </td>
            <td className="px-4 py-2">
              <input
                type="text"
                name="weight"
                value={fuel.weight}
                onChange={(e) => handleInputChange(e, fuel, setFuel, false, MAX_FUEL)}
                className="border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Fuel Weight"
                title={Max ${MAX_FUEL} KGS}
              />
            </td>
            <td className="px-4 py-2">
              <input
                type="text"
                value={fuel.arm}
                readOnly
                className="border border-gray-300 rounded px-2 py-1 w-full bg-gray-100 cursor-not-allowed"
                aria-label="Fuel Arm"
              />
            </td>
            <td className="px-4 py-2">
              <input
                type="text"
                value={fuel.moment.toFixed(2)}
                readOnly
                className="border border-gray-300 rounded px-2 py-1 w-full bg-gray-100 cursor-not-allowed"
                aria-label="Fuel Moment"
              />
            </td>
          </tr>

          {/* BAGGAGE */}
          <tr className="border-b border-gray-200 hover:bg-gray-100">
            <td className="px-4 py-3 font-semibold">
              BAGGAGE (MAX {MAX_BAGGAGE} KGS)
            </td>
            <td className="px-4 py-2">
              <input
                type="text"
                name="weight"
                value={baggage.weight}
                onChange={(e) => handleInputChange(e, baggage, setBaggage, false, MAX_BAGGAGE)}
                className="border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Baggage Weight"
                title={Max ${MAX_BAGGAGE} KGS}
              />
            </td>
            <td className="px-4 py-2">
              <input
                type="text"
                value={baggage.arm}
                readOnly
                className="border border-gray-300 rounded px-2 py-1 w-full bg-gray-100 cursor-not-allowed"
                aria-label="Baggage Arm"
              />
            </td>
            <td className="px-4 py-2">
              <input
                type="text"
                value={baggage.moment.toFixed(2)}
                readOnly
                className="border border-gray-300 rounded px-2 py-1 w-full bg-gray-100 cursor-not-allowed"
                aria-label="Baggage Moment"
              />
            </td>
          </tr>

          {/* A.U.W. */}
          <tr className="bg-gray-200 font-bold">
            <td className="px-4 py-3">A.U.W. (MAX 750 KGS.)</td>
            <td className="px-4 py-2">
              <input
                type="text"
                value={totalWeight.toFixed(2)}
                readOnly
                className="border border-gray-300 rounded px-2 py-1 w-full bg-gray-100 cursor-not-allowed"
                aria-label="A.U.W. Weight"
              />
            </td>
            <td className="px-4 py-2">
              <input
                type="text"
                value={TAKE OFF C.O.G: ${takeoffCOG}}
                readOnly
                className="border border-gray-300 rounded px-2 py-1 w-full bg-gray-100 cursor-not-allowed font-semibold"
                aria-label="Takeoff Center of Gravity"
              />
            </td>
            <td className="px-4 py-2">
              <input
                type="text"
                value={totalMoment.toFixed(2)}
                readOnly
                className="border border-gray-300 rounded px-2 py-1 w-full bg-gray-100 cursor-not-allowed"
                aria-label="Total Moment"
              />
            </td>
          </tr>

          {/* FUEL BURN */}
          <tr className="border-t border-gray-300">
            <td className="px-4 py-3 font-semibold">EST FUEL BURN OFF 14KGS/HR</td>
            <td className="px-4 py-2">
              <input
                type="text"
                name="weight"
                value={fuelBurn.weight}
                onChange={(e) => handleInputChange(e, fuelBurn, setFuelBurn, false, parseFloat(fuel.weight) || MAX_FUEL)}
                className="border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Fuel Burn Weight"
              />
            </td>
            <td className="px-4 py-2">
              <input
                type="text"
                value={fuelBurn.arm}
                readOnly
                className="border border-gray-300 rounded px-2 py-1 w-full bg-gray-100 cursor-not-allowed"
                aria-label="Fuel Burn Arm"
              />
            </td>
            <td className="px-4 py-2">
              <input
                type="text"
                value={fuelBurn.moment.toFixed(2)}
                readOnly
                className="border border-gray-300 rounded px-2 py-1 w-full bg-gray-100 cursor-not-allowed"
                aria-label="Fuel Burn Moment"
              />
            </td>
          </tr>

          {/* LANDING */}
          <tr className="bg-gray-200 font-bold">
            <td className="px-4 py-3">LANDING WEIGHT</td>
            <td className="px-4 py-2">
              <input
                type="text"
                value={landingWeight.toFixed(2)}
                readOnly
                className="border border-gray-300 rounded px-2 py-1 w-full bg-gray-100 cursor-not-allowed"
                aria-label="Landing Weight"
              />
            </td>
            <td className="px-4 py-2">
              <input
                type="text"
                value={LANDING C.O.G: ${landingCOG}}
                readOnly
                className="border border-gray-300 rounded px-2 py-1 w-full bg-gray-100 cursor-not-allowed font-semibold"
                aria-label="Landing Center of Gravity"
              />
            </td>
            <td className="px-4 py-2">
              <input
                type="text"
                value={landingMoment.toFixed(2)}
                readOnly
                className="border border-gray-300 rounded px-2 py-1 w-full bg-gray-100 cursor-not-allowed"
                aria-label="Landing Moment"
              />
            </td>
          </tr>
        </tbody>
      </table>

{/* C.O.G MOMENT ENVELOPE CHART */}
<div className="mt-12">
<h2 className="text-xl font-semibold mb-4 text-center">C.O.G MOMENT ENVELOPE</h2>
<ResponsiveContainer width="95%" height={500}>d
<ComposedChart data={envelopePoints} margin={{ top: 20, right: 20, left: 40, bottom: 40 }}>
<CartesianGrid  stroke="rgba(0, 0, 0, 0.4)"
interval={4}  />
   <CartesianGrid
      stroke="rgba(0, 0, 0, 0.1)"
      strokeWidth={0.5}
      interval={0}  // shows all lines
      vertical={true}
      horizontal={true}
    />
  <XAxis
  type="number"
  dataKey="moment"  
  label={{
    value: 'LOADED AIRCRAFT MOMENT (M.KG)',
    position: 'insideBottom',
    offset: 0,
    style: {
      fill: '#333',
      fontSize: '0.9rem',
      fontWeight: '600',
    }
  }}
  domain={[() => 400, () => 700]}
  ticks={[400, 410, 420, 430, 440, 450, 460, 470, 480, 490, 500, 510, 520, 530, 540, 550, 560, 570, 580, 590, 600, 610, 620, 630, 640, 650, 660, 670, 680, 690, 700]}

  tickCount={31} 
  tick={{
    fill: '#555',
    fontSize: '1.5 rem',
    fontWeight: 'bold'
  }}
  tickFormatter={(value) => value % 50 === 0 ? value.toFixed(0) : ''}
  height={40}
/>

<YAxis
  type="number"
  dataKey="weight"
  label={{
    value: 'LOADED AIRCRAFT WEIGHT (KG)',
    angle: -90,
    position: 'insideLeft',
    offset: 7,
    dy: 40,
    style: {
      fill: '#333',
      fontSize: '0.9rem',
      fontWeight: '600'
    }
  }}
  domain={[() => 550, () => 750]}
  ticks={[550, 560, 570, 580, 590, 600, 610, 620, 630, 640, 650, 660, 670, 680, 690, 700, 710, 720, 730, 740, 750]}
  /* ticks={[550, 600, 650, 700, 750]} */
  tickCount={31} 
  tick={{
    fill: '#555',
    fontSize: '1.5 rem',
    fontWeight: 'bold'
  }}
  tickFormatter={(value) => value % 50 === 0 ? value.toFixed(0) : ''}
  width={60}
/>
<Tooltip />
 <Legend />
    
  <Customized component={drawEnvelopeArea} />



          <Scatter data={[takeoffPoint]} name={TAKEOFF C.O.G(${takeoffCOG})} fill={isTakeoffOutOfEnvelope ? 'red' : 'brown'} shape="circle" r={8} />
          <Scatter data={[landingPoint]} name={LANDING C.O.G(${landingCOG})} fill={isLandingOutOfEnvelope ? 'red' : 'green'} shape="square" r={8} />

          {/* Reference Lines for Takeoff */}
          <ReferenceLine x={takeoffPoint.moment} stroke="brown" strokeWidth={1.5} strokeDasharray="5 3">
            <Label value={${takeoffPoint.moment}} position="top" dx={5} fill="brown" style={{ fontSize: '0.8rem', fontWeight: 600 }} />
          </ReferenceLine>
          <ReferenceLine y={takeoffPoint.weight} stroke="brown" strokeWidth={1.5} strokeDasharray="5 3">
            <Label value={${takeoffPoint.weight}} position="left" fill="brown"  style={{ fontSize: '0.8rem', fontWeight: 600 }} />
          </ReferenceLine>

          {/* Reference Lines for Landing */}
          <ReferenceLine x={landingPoint.moment} stroke="green" strokeWidth={1.5} strokeDasharray="5 3">
            <Label value={${landingPoint.moment}} position="top" dx={-5} fill="green" style={{ fontSize: '0.8rem', fontWeight: 600 }} />
          </ReferenceLine>
          <ReferenceLine y={landingPoint.weight} stroke="green" strokeWidth={1.5} strokeDasharray="5 3">
            <Label value={${landingPoint.weight}} position="left" fill="green" style={{ fontSize: '0.8rem', fontWeight: 600 }} />
          </ReferenceLine>

          {/* Out of Limit Warnings */}
{isTakeoffOutOfEnvelope && (
  <ReferenceLine
    x={takeoffPoint.x}
    y={takeoffPoint.y}
    stroke="red"
    strokeWidth={0}
    label={{
      position: "top",
      value: "⚠ Takeoff C.O.G OUT OF LIMIT",
      fill: "red",
      fontSize: 12,
      fontWeight: "bold",
    }}
  />
)}
{isLandingOutOfEnvelope && (
  <ReferenceLine
    x={landingPoint.x}
    y={landingPoint.y}
    stroke="red"
    strokeWidth={0}
    label={{
      position: "bottom",
      value: "⚠ Landing C.O.G OUT OF LIMIT",
      fill: "red",
      fontSize: 12,
      fontWeight: "bold",
    }}
  />
)}

        </ComposedChart>
      </ResponsiveContainer>



{/* Loading Graph: Weight vs Moment with Diagonal Lines */}
<div className="mt-16">
  <h2 className="text-xl font-semibold mb-4 text-center">LOADING GRAPH</h2>
  <ResponsiveContainer width="95%" height={500}>
    <ComposedChart
      margin={{ top: 20, right: 40, bottom: 40, left: 60 }}
    >
    {/* Major Grid: thicker, darker lines every 20 units (approx) */}
    <CartesianGrid
      stroke="rgba(0, 0, 0, 0.4)"
      strokeWidth={1}
      interval={19}  // draws line every 20th tick (0-based)
    />
    
    {/* Minor Grid: thin, light dashed lines every 1 unit */}
    <CartesianGrid
      stroke="rgba(0, 0, 0, 0.1)"
      strokeWidth={0.5}
      strokeDasharray="3 3"
      interval={0}  // draws every tick line
      vertical={true}
      horizontal={true}
    />

    <XAxis
      type="number"
      dataKey="moment"
      label={{
        value: 'LOAD MOMENT (M.KG)',
        position: 'insideBottom',
        offset: -10,
        style: { fill: '#333', fontSize: '0.9rem', fontWeight: '600' },
      }}
      domain={[() => 0, () => 180]}
      ticks={majorTicks}
    />

    <YAxis
      type="number"
      dataKey="weight"
      label={{
        value: 'LOAD WEIGHT (KG)',
        angle: -90,
        position: 'insideLeft',
        offset: 0,
        style: { fill: '#333', fontSize: '0.9rem', fontWeight: '600' },
      }}
      domain={[0, 180]}
      ticks={majorTicks} 
    />
      <Tooltip />
      <Legend />

{/* Pilot & Pax (Steepest Angle ~55°) */}
  <ReferenceLine
    segment={[
      { x: 0, y: 0 },
      { x: 170, y: 170 },
    ]}
    stroke="#10B981"
    strokeWidth={3}
  />

  {/* Fuel Line */}
  <ReferenceLine
    segment={[
      { x: 0, y: 0 },
      { x: 101.65, y: 95 },
    ]}
    stroke="#F59E0B"
    strokeWidth={3}
  />

  {/* Baggage Line */}
  <ReferenceLine
    segment={[
      { x: 0, y: 0 },
      { x: 81, y: 54 },
    ]}
    stroke="#EF4444"
    strokeWidth={3}
  />

{/* === DYNAMIC CURRENT LOADING VECTORS === */}
     <ReferenceLine
    segment={[{ x: 0, y: 0 }, { x: pilotMoment, y: pilotWeight }]}
    stroke="#10B981"
    strokeWidth={3}
  />
  <ReferenceDot
    x={pilotMoment}
    y={pilotWeight}
    r={5}
    fill="#10B981"
    stroke="#065F46"
    strokeWidth={2}
  />

  {/* Fuel */}
  <ReferenceLine
    segment={[{ x: 0, y: 0 }, { x: fuelMoment, y: fuelWeight }]}
    stroke="#F59E0B"
    strokeWidth={3}
  />
  <ReferenceDot
    x={fuelMoment}
    y={fuelWeight}
    r={5}
    fill="#F59E0B"
    stroke="#B45309"
    strokeWidth={2}
  />

  {/* Baggage */}
  <ReferenceLine
    segment={[{ x: 0, y: 0 }, { x: baggageMoment, y: baggageWeight }]}
    stroke="#EF4444"
    strokeWidth={3}
  />
  <ReferenceDot
    x={baggageMoment}
    y={baggageWeight}
    r={5}
    fill="#EF4444"
    stroke="#991B1B"
    strokeWidth={2}
  />

    </ComposedChart>
  </ResponsiveContainer>

  <div className="flex flex-wrap gap-4 mt-4 justify-center text-sm text-gray-700">
  <div className="flex items-center gap-2">
    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#10B981' }} />
    <span>PILOT & PAX</span>
  </div>
  <div className="flex items-center gap-2">
    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#F59E0B' }} />
    <span>FUEL</span>
  </div>
  <div className="flex items-center gap-2">
    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#EF4444' }} />
    <span>BAGGAGE</span>
  </div>

</div>

</div>
     

</div>
</div>
  );
};


  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header/Navbar */}
      <header className="bg-white shadow-sm px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                <div className="grid grid-cols-2 gap-0.5">
                  <div className="w-1.5 h-1.5 bg-white rounded-sm"></div>
                  <div className="w-1.5 h-1.5 bg-white rounded-sm"></div>
                  <div className="w-1.5 h-1.5 bg-white rounded-sm"></div>
                  <div className="w-1.5 h-1.5 bg-white rounded-sm"></div>
                </div>
              </div>
            </div>
            
            {/* Navigation Links */}
            <nav className="flex space-x-6">
              <a href="#" className="text-gray-900 font-medium hover:text-blue-600">Home</a>
              <a href="#" className="text-gray-600 hover:text-blue-600">History</a>
              <a href="#" className="text-gray-600 hover:text-blue-600">Tower</a>
              <a href="#" className="text-gray-600 hover:text-blue-600">Help</a>
            </nav>
          </div>
          
          {/* Right side - Profile */}
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-medium">
              M
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Welcome</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            You're on our Home page. Here's where you'll enter your load sheet data and we will do the rest for you.
          </p>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-lg shadow-sm">
          {/* Tab Headers */}
          <div className="flex space-x-1 p-1 bg-gray-50 rounded-t-lg">
            <TabButton 
              label="Sheet" 
              isActive={activeTab === 'Sheet'} 
              onClick={setActiveTab} 
            />
            <TabButton 
              label="Results" 
              isActive={activeTab === 'Results'} 
              onClick={setActiveTab} 
            />
            <TabButton 
              label="Misc" 
              isActive={activeTab === 'Misc'} 
              onClick={setActiveTab} 
            />
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'Sheet' && (
              <div>
                <h3 className="text-2xl font-bold text-center mb-8 text-gray-700">Weight and Balance Sheet</h3>
                <WeightBalanceForm />
              </div>
            )}
            
            {activeTab === 'Results' && (
              <div className="text-center py-20">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Results Summary</h3>
                <div className="max-w-2xl mx-auto space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Total Weight: <span className="font-semibold">{totalWeight.toFixed(2)} KGS</span></p>
                    <p className="text-sm text-gray-600">Takeoff C.O.G: <span className="font-semibold">{takeoffCOG}</span></p>
                    <p className="text-sm text-gray-600">Landing Weight: <span className="font-semibold">{landingWeight.toFixed(2)} KGS</span></p>
                    <p className="text-sm text-gray-600">Landing C.O.G: <span className="font-semibold">{landingCOG}</span></p>
                  </div>
                  {totalWeight === 0 ? (
                    <p className="text-gray-500">Complete the weight and balance form to see results here.</p>
                  ) : (
                    <p className="text-green-600 font-medium">Weight and balance calculations complete!</p>
                  )}
                </div>
              </div>
            )}
            
            {activeTab === 'Misc' && (
              <div className="text-center py-20">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Miscellaneous</h3>
                <p className="text-gray-500">Additional tools and information will be available here.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-800 rounded flex items-center justify-center">
                <div className="grid grid-cols-2 gap-0.5">
                  <div className="w-1 h-1 bg-white rounded-sm"></div>
                  <div className="w-1 h-1 bg-white rounded-sm"></div>
                  <div className="w-1 h-1 bg-white rounded-sm"></div>
                  <div className="w-1 h-1 bg-white rounded-sm"></div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-16">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Quick links</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-600 hover:text-blue-600">Blog</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Resources</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-600 hover:text-blue-600">Documentation</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;