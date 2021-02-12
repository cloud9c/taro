import { entityToJSON } from '../../examples/js/Jsonify.js';

export function SidebarScene( editor ) {

	const inspector = editor.inspector;
	const viewport = editor.viewport;
	const renderer = editor.app.renderer;
	const render = editor.render;
	const scene = viewport.scene;

	function closeParent( target ) {

		const recursion = ( children ) => {

			for ( let i = 0, len = children.length; i < len; i ++ ) {

				children[ i ].style.setProperty( 'display', 'none' );

				const grandChildren = document.querySelectorAll( '#scene [data-parent="' + children[ i ].dataset.id + '"]' );

				if ( grandChildren.length > 0 ) {

					recursion( grandChildren );

				}

			}

		};

		recursion( document.querySelectorAll( '#scene [data-parent="' + target.dataset.id + '"]' ) );

		delete target.dataset.opened;

	}

	function openParent( target ) {

		const recursion = ( children ) => {

			for ( let i = 0, len = children.length; i < len; i ++ ) {

				children[ i ].style.removeProperty( 'display' );

				if ( children[ i ].dataset.opened !== undefined ) {

					const grandChildren = document.querySelectorAll( '#scene [data-parent="' + children[ i ].dataset.id + '"]' );

					if ( grandChildren.length > 0 ) {

						recursion( grandChildren );

					}

				}

			}

		};

		recursion( document.querySelectorAll( '#scene [data-parent="' + target.dataset.id + '"]' ) );

		target.dataset.opened = '';

	}

	this.openParent = openParent;

	const contextmenu = document.getElementById( 'contextmenu' );
	function clearContext() {

		while ( contextmenu.firstChild !== null ) {

			contextmenu.removeChild( contextmenu.lastChild );

		}

		contextmenu.style.display = '';

	}

	const sceneElement = document.getElementById( 'scene' );

	contextmenu.addEventListener( 'contextmenu', event => event.preventDefault() );
	sceneElement.addEventListener( 'contextmenu', event => event.preventDefault() );

	let clipboard;
	let clipboardParent;

	document.addEventListener( 'pointerup', ( event ) => {

		clearContext();

		const target = event.target;

		if ( sceneElement.contains( target ) ) {

			// if clicking on empty space
			if ( target === sceneElement ) {

				const oldTarget = document.querySelector( '#scene [data-selected]' );
				if ( oldTarget !== null ) delete oldTarget.dataset.selected;

				viewport.detach();
				editor.render();

			} else { // if clicking in the scene tree area

				// if clicking on the dropdown button
				if ( target.classList.contains( 'parent' ) && event.clientX - target.getBoundingClientRect().left < parseFloat( window.getComputedStyle( target ).getPropertyValue( 'padding-left' ) ) ) {

					if ( target.dataset.opened !== undefined ) closeParent( target );
					else openParent( target );

				} else {

					// select the entity
					const oldTarget = document.querySelector( '#scene [data-selected]' );
					if ( oldTarget !== target ) {

						if ( oldTarget !== null ) delete oldTarget.dataset.selected;
						target.dataset.selected = '';

						const entity = scene.getEntityById( parseInt( target.dataset.id ) );

						viewport.attach( entity );
						editor.render();

					}

					// if right click, open contextmenu

					if ( event.button === 2 ) {

						contextmenu.style.left = event.clientX + 'px';
						contextmenu.style.top = event.clientY + 'px';

						const copyButton = document.createElement( 'DIV' );
						copyButton.textContent = 'Copy';
						copyButton.dataset.shortcut = 'Ctrl+C';
						copyButton.addEventListener( 'pointerup', () => {

							clipboard = entityToJSON( viewport.currentEntity );
							clipboardParent = viewport.currentEntity.parent;
							console.log( clipboard );

						} );

						const pasteButton = document.createElement( 'DIV' );
						pasteButton.textContent = 'Paste';
						pasteButton.dataset.shortcut = 'Ctrl+V';
						pasteButton.addEventListener( 'pointerup', () => {

							editor.addEntity( clipboard.name, clipboard, clipboardParent );

						} );

						const pasteAsChildButton = document.createElement( 'DIV' );
						pasteAsChildButton.textContent = 'Paste as Child';
						pasteAsChildButton.dataset.shortcut = 'Ctrl+Shift+V';
						pasteAsChildButton.dataset.line = '';
						pasteAsChildButton.addEventListener( 'pointerup', () => {

							console.log( 'here' );

						} );

						const deleteButton = document.createElement( 'DIV' );
						deleteButton.textContent = 'Delete';
						deleteButton.dataset.shortcut = 'Del';
						deleteButton.addEventListener( 'pointerup', () => {

							console.log( 'here' );

						} );

						contextmenu.append( copyButton );
						contextmenu.append( pasteButton );
						contextmenu.append( pasteAsChildButton );
						contextmenu.append( deleteButton );

						contextmenu.style.display = 'block';

					}

				}

			}

		}

	} );

}
