/*
*****************************************
*		Model for Truck		*
*****************************************
* defines the properties related to the Truck 
* @author Dinesh
*/

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );

  /**
   *
   * @constructor 
   */


  function Truck( baseHeight, rampHeight, truckLength, rampLength, minLength, maxLength, friction, rampLENGTH  ) {

    PropertySet.call( this, { 
	rampLength: 150,	// rampLength gives the horizontal distance between tips of the ramp (it is not the actual "Length of the ramp") 
	friction: 0.5,		// coefficient of friction		
	baseHeight:25,		// distance between base of the truck and ground (px)
	truckLength:75,		// length parameter used in truck visualization (px) (proportional to length of the truck but not equal)
	rampHeight: 50, 	// distance between base of the truck and top of the truck (px)
	rampAngle:0,		// angle at which the ramp is inclined w.r.t ground (rad)
	scale:150,		// conversion scale (metres to px) 1meter = 150px
	minH: 0.2, 		// minimum total ramp Height (totalHeight) in meters
	maxH: 0.8, 		//maximum total ramp Height (totalHeight) in meters 
	rLmin: 0.5,		// minimum rampLength in meters
	rLmax: 2, 		// maximum rampLength in meters

	} );


	this.addDerivedProperty('totalHeight',['baseHeight','rampHeight'], function(baseHeight, rampHeight) { return baseHeight+rampHeight; } );    //total height of the ramp = rampHeight+ baseHeight
	this.addDerivedProperty('totalLength',['totalHeight','rampLength'], function(totalHeight, rampLength) { return (Math.sqrt(totalHeight*totalHeight + rampLength*rampLength)).toFixed(2); } );  
	//total length of the ramp = sqrt( totalHeight^2 + rampLength^2);

	this.addDerivedProperty('idealMA',['totalHeight','totalLength'], function(totalHeight, totalLength) { return totalLength/totalHeight; } );  //ideal MA

  }
  return inherit( PropertySet, Truck , {
	
	updateRampAngle: function() //update ramp angle
	{
		this.rampAngle = Math.atan((this.baseHeight+this.rampHeight)/(this.rampLength));
	}, 

	resetRampLength: function()  //reset the rampLength & rampHeight to default values
	{	
		this.rampHeight= 50;
		this.rampLength= 150;	
	}

  } );


} );
