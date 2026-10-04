(function(root){
  'use strict';
  const coefficients={safetyCeiling:12000,safetyRate:5,water:18,plants:7,cars:90,structures:70,application:60};
  function calculate(salt,safety=1,waterSensitivity=1){
    if(!Number.isFinite(salt)||salt<0||salt>20||!Number.isFinite(safety)||safety<0.5||safety>2||!Number.isFinite(waterSensitivity)||waterSensitivity<0.5||waterSensitivity>2) throw new RangeError('Inputs outside model range');
    const benefit=coefficients.safetyCeiling*safety*(1-Math.exp(-salt/coefficients.safetyRate));
    const water=coefficients.water*waterSensitivity*salt*salt,plants=coefficients.plants*salt*salt;
    const cars=coefficients.cars*salt,structures=coefficients.structures*salt,application=coefficients.application*salt;
    const environment=water+plants,cost=environment+cars+structures+application;
    return {salt,benefit,water,plants,cars,structures,application,environment,cost,net:benefit-cost};
  }
  function nextTon(salt,safety=1,waterSensitivity=1){
    if(salt>19)throw new RangeError('The next ton must be within the 20-ton model range');
    const a=calculate(salt,safety,waterSensitivity),b=calculate(salt+1,safety,waterSensitivity);
    return {benefit:b.benefit-a.benefit,environment:b.environment-a.environment,cost:b.cost-a.cost,net:b.net-a.net};
  }
  function summary(safety=1,waterSensitivity=1){
    let firstEnvironment=null,firstAllCosts=null,best=calculate(0,safety,waterSensitivity);
    for(let x=0;x<=20;x++){
      const c=calculate(x,safety,waterSensitivity);if(c.net>best.net)best=c;
      if(x<20){const n=nextTon(x,safety,waterSensitivity);if(firstEnvironment===null&&n.environment>n.benefit)firstEnvironment=x;if(firstAllCosts===null&&n.cost>n.benefit)firstAllCosts=x;}
    }
    return {firstEnvironment,firstAllCosts,best};
  }
  const api={coefficients,calculate,nextTon,summary};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SaltModel=api;
})(typeof globalThis!=='undefined'?globalThis:this);
