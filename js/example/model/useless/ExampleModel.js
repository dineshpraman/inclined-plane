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
  var BarMagnet = require( 'EXAMPLE_SIM/example/model/BarMagnet' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var Vector2 = require( 'DOT/Vector2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Range = require( 'DOT/Range' );

  /**
   * Main constructor for ExampleModel, which creates the bar magnet..
   * @constructor
   */
  function ExampleModel() {

    // model elements
    var initialMass=1;
    var initialSize= new Dimension2( 50, 50 );
    this.barMagnet = new BarMagnet( new Vector2( 0, 0 ), initialSize, 0, false, initialMass, new Range(1,100) );
  }

  return inherit( Object, ExampleModel, {

    // Resets all model elements
    reset: function() {
      this.barMagnet.reset();
    },

    // Called by the animation loop. Optional, so if your model has no animation, you can omit this.
    step: function() {
      // Handle model animation here.
    }
  } );
} );
