import React, { useState } from 'react';
import {
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Scatter,
  ReferenceLine,
  Label,
  Legend,
} from 'recharts';

const isPositiveNumber = (val) => /^\d*\.?\d*$/.test(String(val).trim());

const Homepage = () => {
  const [activeTab, setActiveTab] = useState('Sheet');
  
  // Weight and Balance form state
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

  const WeightBalanceForm = () => {
    const envelopeData = [
      { moment: 367.57, weight: 499 },
      { moment: 434.86, weight: 590 },
      { moment: 590.03, weight: 726 },
      { moment: 691.5, weight: 726 },
      { moment: 562.13, weight: 590 },
      { moment: 443.67, weight: 499 },
      { moment: 367.57, weight: 499 },
    ];

    const takeoffPoint = { moment: totalMoment, weight: totalWeight, name: `Takeoff (${takeoffCOG})` };
    const landingPoint = { moment: landingMoment, weight: landingWeight, name: `Landing (${landingCOG})` };

    const envelopeMinMoment = 475;
    const envelopeMaxMoment = 780;
    const envelopeMinWeight = 500;
    const envelopeMaxWeight = 750;

    const isTakeoffOutOfEnvelope =
      takeoffPoint.moment < envelopeMinMoment ||
      takeoffPoint.moment > envelopeMaxMoment ||
      takeoffPoint.weight < envelopeMinWeight ||
      takeoffPoint.weight > envelopeMaxWeight;

    const isLandingOutOfEnvelope =
      landingPoint.moment < envelopeMinMoment ||
      landingPoint.moment > envelopeMaxMoment ||
      landingPoint.weight < envelopeMinWeight ||
      landingPoint.weight > envelopeMaxWeight;

    return (
      <div className="space-y-8">
        <div className="overflow-x-auto">
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
                    title={`Max ${MAX_FUEL} KGS`}
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
                    title={`Max ${MAX_BAGGAGE} KGS`}
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
                    value={`TAKE OFF C.O.G: ${takeoffCOG}`}
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
                    value={`LANDING C.O.G: ${landingCOG}`}
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
        </div>

        {/* Chart */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-center">C.O.G MOMENT ENVELOPE</h3>
          <ResponsiveContainer width="100%" height={500}>
            <ComposedChart data={envelopeData} margin={{ top: 20, right: 20, left: 40, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                type="number"
                dataKey="moment"
                label={{
                  value: 'LOADED AIRCRAFT MOMENT (M.KG)',
                  position: 'insideBottom',
                  offset: 0,
                  style: {
                    fill: '#333',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }
                }}
                domain={[450, 800]}
                tick={{
                  fill: '#555',
                  fontSize: '0.8rem'
                }}
                tickCount={7}
                tickFormatter={(value) => value.toFixed(0)}
                height={40}
              />
              <YAxis
                type="number"
                dataKey="weight"
                label={{
                  value: 'LOADED AIRCRAFT WEIGHT (KG)',
                  angle: -90,
                  position: 'insideLeft',
                  offset: 10,
                  style: {
                    fill: '#333',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }
                }}
                domain={[450, 800]}
                tick={{
                  fill: '#555',
                  fontSize: '0.8rem'
                }}
                tickCount={7}
                tickFormatter={(value) => value.toFixed(0)}
                width={60}
              />
              <Tooltip />
              <Legend />

              <Area dataKey="weight" data={envelopeData} stroke="#8884d8" fill="#8884d8" fillOpacity={0.2} strokeWidth={2} name="C.O.G Envelope" isAnimationActive={false} connectNulls />

              <Scatter data={[takeoffPoint]} name={`Take Off C.O.G(${takeoffCOG})`} fill={isTakeoffOutOfEnvelope ? 'red' : 'brown'} shape="circle" r={8} />
              <Scatter data={[landingPoint]} name={`Landing C.O.G(${landingCOG})`} fill={isLandingOutOfEnvelope ? 'red' : 'green'} shape="square" r={8} />

              {/* Reference Lines for Takeoff */}
              <ReferenceLine x={takeoffPoint.moment} stroke="brown" strokeWidth={1.5} strokeDasharray="5 3">
                <Label value={`${takeoffPoint.moment}`} position="top" fill="brown" style={{ fontSize: '0.8rem', fontWeight: 600 }} />
              </ReferenceLine>
              <ReferenceLine y={takeoffPoint.weight} stroke="brown" strokeWidth={1.5} strokeDasharray="5 3">
                <Label value={`${takeoffPoint.weight}`} position="insideRight" fill="brown" dy={-10} style={{ fontSize: '0.8rem', fontWeight: 600 }} />
              </ReferenceLine>

              {/* Reference Lines for Landing */}
              <ReferenceLine x={landingPoint.moment} stroke="green" strokeWidth={1.5} strokeDasharray="5 3">
                <Label value={`${landingPoint.moment}`} position="bottom" fill="green" style={{ fontSize: '0.8rem', fontWeight: 600 }} />
              </ReferenceLine>
              <ReferenceLine y={landingPoint.weight} stroke="green" strokeWidth={1.5} strokeDasharray="5 3">
                <Label value={`${landingPoint.weight}`} position="left" fill="green" style={{ fontSize: '0.8rem', fontWeight: 600 }} />
              </ReferenceLine>

              {/* Envelope Boundary Lines */}
              <ReferenceLine x={envelopeMinMoment} stroke="#8884d8" strokeDasharray="3 3" strokeOpacity={0.5} />
              <ReferenceLine x={envelopeMaxMoment} stroke="#8884d8" strokeDasharray="3 3" strokeOpacity={0.5} />
              <ReferenceLine y={envelopeMinWeight} stroke="#8884d8" strokeDasharray="3 3" strokeOpacity={0.5} />
              <ReferenceLine y={envelopeMaxWeight} stroke="#8884d8" strokeDasharray="3 3" strokeOpacity={0.5} />
            </ComposedChart>
          </ResponsiveContainer>
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