// Copyright 2002-2013, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var ExampleScreen = require( 'EXAMPLE_SIM/example/ExampleScreen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  var simTitle = require( 'string!EXAMPLE_SIM/example-sim.name' );

  var simOptions = {
    credits: {
      // all credits fields are optional, see joist.AboutDialog
      leadDesign: 'Dinesh',
      softwareDevelopment: 'Dinesh',
      team: 'CoMPASS',
      qualityAssurance: 'No QA',
      graphicArts: 'PhET',
      thanks: 'Thanks to PhET!'
    }
  };

  // Appending '?dev' to the URL will enable developer-only features.
  if ( window.phetcommon.getQueryParameter( 'dev' ) ) {
    simOptions = _.extend( {
      // add dev-specific options here
    }, simOptions );
  }

  SimLauncher.launch( function() {
    var sim = new Sim( simTitle, [ new ExampleScreen() ], simOptions );
    sim.start();
  } );
} );
