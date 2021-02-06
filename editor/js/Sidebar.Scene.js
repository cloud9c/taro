import * as TARO from '../../build/taro.module.js';

export function SidebarScene( editor ) {

	const inspector = editor.inspector;
	const viewport = editor.viewport;
	const renderer = editor.app.renderer;
	const render = editor.render;
	const scene = viewport.scene;

	this.closeParent = function closeParent( target ) {

		const recursion = ( children ) => {

			for ( let i = 0, len = children.length; i < len; i ++ ) {

				children[ i ].style.setProperty( 'display', 'none' );

				const grandChildren = document.querySelectorAll( '#scene-tree [data-parent="' + children[ i ].dataset.id + '"]' );

				if ( grandChildren.length > 0 ) {

					recursion( grandChildren );

				}

			}

		};

		recursion( document.querySelectorAll( '#scene-tree [data-parent="' + target.dataset.id + '"]' ) );

		delete target.dataset.opened;

	};

	function openParent( target ) {

		const recursion = ( children ) => {

			for ( let i = 0, len = children.length; i < len; i ++ ) {

				children[ i ].style.removeProperty( 'display' );

				if ( children[ i ].dataset.opened !== undefined ) {

					const grandChildren = document.querySelectorAll( '#scene-tree [data-parent="' + children[ i ].dataset.id + '"]' );

					if ( grandChildren.length > 0 ) {

						recursion( grandChildren );

					}

				}

			}

		};

		recursion( document.querySelectorAll( '#scene-tree [data-parent="' + target.dataset.id + '"]' ) );

		target.dataset.opened = '';

	}

	this.openParent = openParent;

	document.getElementById( 'scene-tree' ).addEventListener( 'pointerup', function ( event ) {

		const target = event.target;

		if ( target.tagName !== 'SECTION' ) {

			if ( target.classList.contains( 'parent' ) && event.clientX - target.getBoundingClientRect().left < parseFloat( window.getComputedStyle( target ).getPropertyValue( 'padding-left' ) ) ) {

				if ( target.dataset.opened !== undefined ) closeParent( target );
				else openParent( target );

			} else {

				const oldTarget = document.querySelector( '#scene-tree [data-selected]' );
				if ( oldTarget === target ) return;
				if ( oldTarget !== null ) delete oldTarget.dataset.selected;
				target.dataset.selected = '';

				const entity = scene.getEntityById( parseInt( target.dataset.id ) );

				viewport.attach( entity );
				editor.render();

			}

		}

	} );

}
