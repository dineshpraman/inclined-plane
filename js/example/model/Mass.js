/*
*****************************************
*		Model for Mass		*
*****************************************
* defines the properties of the Mass  
* author:Dinesh
*/

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Vector2 = require( 'DOT/Vector2' );
  var Range = require( 'DOT/Range' );



  //constructor - defines various parameters/properties (including some derived properties)

  function Mass() {
    PropertySet.call( this, {
 
	weight: 5,				//weight of the carton (Newtons - N)	                            
	location: new Vector2(0,0),		//location of the carton
	startLocation: new Vector2(0,0), 	//starting location(at the bottom of the ramp)
	size: 40,				//width/length of the carton in px. Default value for the given weight
	orientation: 0,				// same as Truck.rampAngle (angle at which the ramp is inclined w.r.t ground)
	massRange: new Range(5,15),		//range of the weight of the carton in N
	sizeRange: new Range(40,50),		//corresponding range of the siZe(wdith) of the carton in px
	maxFriction:0,				//maximum friction force (u*N)
	GForce:0,				// Gravitational force M*g*sin(A)
	appliedForce:0,				//force applied on the carton
	work:0,					//work done by the force in moving the carton
	potentialEnergy:0,			//potential energy of the carton
				
	} );


	this.addDerivedProperty('actualMA',['weight','appliedForce'], function(weight, appliedForce) { return weight/appliedForce; } ); 		//acutal MA
	this.addDerivedProperty('thermalEnergy',['work','potentialEnergy'], function(work, potentialEnergy) { return work-potentialEnergy; } );	//thermal energy
  }

  return inherit( PropertySet, Mass );
} );


//for a weight of 1kg, the spans 50px (in width/height)

