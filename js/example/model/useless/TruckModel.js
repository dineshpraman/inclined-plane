// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model for the 'Example' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Truck = require( 'EXAMPLE_SIM/example/model/Truck' );
//  var Dimension2 = require( 'DOT/Dimension2' );
//  var Vector2 = require( 'DOT/Vector2' );
  var inherit = require( 'PHET_CORE/inherit' );
//  var Range = require( 'DOT/Range' );

  /**
   * Main constructor for TruckModel, which creates the Truck parameters ..
   * @constructor
   */
  function TruckModel() {

    // model elements
    this.Truck = new Truck();
  }

  return inherit( Object, TruckModel, {

    // Resets all model elements
    reset: function() {
      this.Truck.reset();
    },

    // Called by the animation loop. Optional, so if your model has no animation, you can omit this.
    step: function() {
      // Handle model animation here.
    }
  } );
} );
