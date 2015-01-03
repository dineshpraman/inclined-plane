/************************************************
*		Model for Simulation		*
*************************************************
*
* Defines simulation state variables
* Instantiates objects Truck, Mass
* Defines some functions 
* Defines the animation loop
*
* author: Dinesh
*/

define( function( require ) {
  'use strict';

  // general modules
  var PropertySet = require( 'AXON/PropertySet' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );

  //specific modules
  var Truck = require( 'EXAMPLE_SIM/example/model/Truck' );
  var Mass = require( 'EXAMPLE_SIM/example/model/Mass' );



  function SimulationModel() {

    PropertySet.call( this, {
      state: 'bottom',   //4 states depending on the position of the carton - bottom, moving, top, completed
      running: false,   // true if sim is running, false if sim is not running
    } );

	this.Truck = new Truck();
	this.Mass = new Mass();
  }



  return inherit( PropertySet, SimulationModel, {

    getStartX: function() {
	return this.Mass.size*Math.sqrt(2)*Math.cos(Math.PI/4+ this.Truck.rampAngle)/2;
    },

    getStartY: function() {
	return this.Mass.size*Math.sqrt(2)*Math.sin(Math.PI/4+ this.Truck.rampAngle)/2;
    },

    getEndX: function() {
	return this.Mass.size*Math.sqrt(2)*Math.cos(Math.PI/4+ this.Truck.rampAngle)/2;
    },

    getEndY: function() {
	return  (this.Mass.size/ (2*Math.cos(this.Truck.rampAngle) ) );
    },

    updateFriction: function(){
	this.Mass.maxFriction= this.Truck.friction*this.Mass.weight*Math.cos(this.Truck.rampAngle); //f=u*mg*cos(alpha)
    },

    updateGForce: function(){
	this.Mass.GForce= this.Mass.weight*Math.sin(this.Truck.rampAngle); //f=mg*sin(alpha)
    },
    getBottomX: function() {  
	return  (this.Mass.size*Math.sin(Math.PI/4-this.Truck.rampAngle) )/Math.sqrt(2);  //bottomX gives the x displacement between the center of the mass and the bottom left of the mass
    },
    getBottomY: function() {
	return  (this.Mass.size*Math.cos(Math.PI/4-this.Truck.rampAngle) )/Math.sqrt(2);
    },
    
   
	
    // Resets all model elements
    reset: function() {

	PropertySet.prototype.reset.call( this );
	this.Mass.reset();
	this.Truck.reset();
	this.Truck.updateRampAngle();
	this.updateFriction();
	this.updateGForce();
	this.state = 'bottom';
	this.running= false;
	this.Truck.resetRampLength();

    },

    // ANIMATION LOOP

    step: function(dt) {

	if( this.running === true ) //do if simulation is running
	{
		var speed=50;
		var dist=speed*dt;  //distance moved by the carton

		if( this.state === 'moving') 
		{	
			this.Mass.location=this.Mass.location.plusXY(dist*Math.cos(this.Truck.rampAngle), -1*dist*Math.sin(this.Truck.rampAngle) ); // (x,y) for the given distance travelled on ramp
			this.Mass.work=this.Mass.appliedForce*this.Mass.location.distance(this.Mass.startLocation);  //calculate work
			this.Mass.potentialEnergy=(this.Mass.location.y-this.Mass.startLocation.y)*-1*this.Mass.weight; //calculate PE
	
		}

		else if( this.state === 'top')
		{	
			this.Mass.location= new Vector2( this.Mass.location.x + dist, this.Mass.location.y );  //move only in horizontal direction
			this.Mass.work=this.Mass.appliedForce*this.Truck.totalLength; //recalibrate the total work done to Force*distance
			this.Mass.potentialEnergy=(this.Truck.rampHeight+this.Truck.baseHeight)*this.Mass.weight; //recalibrate the total work done to M*g*h

		}
		else if(this.state === 'completed')
		{
			//do nothing if the simulation is completed
		}
	}

	else if( this.running === false)
	{

	}

    }

  } );

} );

/********** Simulation States *********************************************************

* bottom - carton is at the bottom of the inclined plane
* moving - carton is moving along the inclined plane
* top - carton has moved to the top, and is moving horizontally along the truck
* completed - carton stops at the top

****************************************************************************************/









