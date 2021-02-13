import { entityToJSON } from '../../examples/js/Jsonify.js';

export function SidebarScene( editor ) {

	const inspector = editor.inspector;
	const viewport = editor.viewport;
	const renderer = editor.app.renderer;
	const render = editor.render;
	const scene = viewport.scene;

	function traverse( children, callback ) {

		for ( let i = 0, len = children.length; i < len; i ++ ) {

			callback( children[ i ] );

			const grandChildren = document.querySelectorAll( '#scene [data-parent="' + children[ i ].dataset.id + '"]' );

			if ( grandChildren.length > 0 ) {

				traverse( grandChildren, callback );

			}

		}

	}

	function closeParent( target ) {

		traverse( document.querySelectorAll( '#scene [data-parent="' + target.dataset.id + '"]' ), ( child ) => {

			child.style.setProperty( 'display', 'none' );

		} );

		delete target.dataset.opened;

	}

	function openParent( target ) {

		traverse( document.querySelectorAll( '#scene [data-parent="' + target.dataset.id + '"]' ), ( child ) => {

			child.style.removeProperty( 'display' );

		} );

		target.dataset.opened = '';

	}

	this.openParent = openParent;

	const contextmenu = document.getElementById( 'contextmenu' );

	function clearContext() {

		while ( contextmenu.firstChild !== null )
			contextmenu.removeChild( contextmenu.lastChild );

		contextmenu.style.display = '';

	}

	contextmenu.addEventListener( 'focusout', clearContext );
	contextmenu.addEventListener( 'pointerup', clearContext );

	function openContextMenu( count ) {

		if ( 240 + event.clientX > window.innerWidth ) {

			contextmenu.style.left = event.clientX - 240 + 'px';

		} else {

			contextmenu.style.left = event.clientX + 'px';

		}

		if ( count * 26 + 8 + event.clientY > window.innerHeight ) {

			contextmenu.style.top = event.clientY - ( count * 26 + 8 + 8 ) + 'px';

		} else {

			contextmenu.style.top = event.clientY + 'px';

		}

		contextmenu.style.display = 'block';
		contextmenu.focus();

	}

	const sceneElement = document.getElementById( 'scene' );

	contextmenu.addEventListener( 'contextmenu', event => event.preventDefault() );
	sceneElement.addEventListener( 'contextmenu', event => event.preventDefault() );

	this.oldTarget;
	this.clipboard;
	this.clipboardEntity;

	this.onCopy = () => {

		if ( viewport.currentEntity === undefined ) return;

		this.clipboard = entityToJSON( viewport.currentEntity, false );
		this.clipboardEntity = viewport.currentEntity;

	};

	this.onPaste = () => {

		if ( this.clipboard === undefined ) return;

		const entity = editor.addEntity( this.clipboard.name, this.clipboard );
		const element = document.querySelector( '#scene div[data-id="' + entity.id + '"' );

		if ( viewport.currentEntity !== undefined && viewport.currentEntity.parent !== scene ) {

			parent = document.querySelector( '#scene div[data-id="' + viewport.currentEntity.parent.id + '"' );
			editor.viewport.onDragStart.call( element );
			editor.viewport.onDrop.call( parent );

		}

		viewport.attach( entity );
		this.oldTarget = element;

	};

	this.onPasteAsChild = () => {

		if ( this.clipboard === undefined || viewport.currentEntity === undefined ) return;

		const entity = editor.addEntity( this.clipboard.name, this.clipboard );
		const element = document.querySelector( '#scene div[data-id="' + entity.id + '"' );

		if ( viewport.currentEntity !== scene ) {

			const parent = viewport.currentEntity !== undefined ? document.querySelector( '#scene div[data-id="' + viewport.currentEntity.id + '"' ) : sceneElement;

			editor.viewport.onDragStart.call( element );
			editor.viewport.onDrop.call( parent );

		}

		viewport.attach( entity );
		this.oldTarget = element;

	};

	function endRename( event ) {

		const element = document.querySelector( '#scene div[data-id="' + viewport.currentEntity.id + '"' );
		element.removeAttribute( 'contentEditable' );
		element.removeAttribute( 'spellcheck' );
		element.removeAttribute( 'tabindex' );

		viewport.currentEntity.name = element.textContent;

		document.getElementById( 'entity-name' ).value = element.textContent;

	}

	this.onRename = () => {

		if ( viewport.currentEntity === undefined ) return;

		const element = document.querySelector( '#scene div[data-id="' + viewport.currentEntity.id + '"' );
		element.contentEditable = true;
		element.spellcheck = false;

		let selection = document.getSelection();
		let range = document.createRange();

		range.setStart( element.childNodes[ 0 ], element.innerText.length );
		range.collapse( true );
		selection.removeAllRanges();
		selection.addRange( range );

		element.addEventListener( 'keydown', ( event ) => {

			if ( event.code === 'Enter' ) {

				endRename( event );
				return false;

			}

		} );

		// element.addEventListener( 'focusout', endRename );

	};

	this.onClone = () => {

		if ( viewport.currentEntity === undefined ) return;

		this.onCopy();
		this.onPaste();

	};

	this.onDelete = () => {

		const entity = viewport.currentEntity;
		if ( entity === undefined ) return;

		viewport.detach();

		entity.traverseEntities( ( child ) => {

			document.querySelector( '#scene div[data-id="' + child.id + '"' ).remove();

		} );

		scene.remove( entity );

		render();

	};

	document.addEventListener( 'keydown', ( event ) => {

		switch ( event.code ) {

			// Copy
			case 'KeyC':
				console.log( event.ctrlKey );
				if ( event.ctrlKey ) this.onCopy();
				break;

			// Paste
			// Paste as Child
			case 'KeyV':
				console.log( 'here' );
				if ( event.ctrlKey ) {

					if ( event.shiftKey )
						this.onPasteAsChild();
					else
						this.onPaste();

				}

				break;

			// Clone
			case 'KeyD':
				if ( event.ctrlKey ) this.onClone();
				break;

			// Delete
			case 'Delete':
			case 'Backspace':
				this.onDelete();

		}

		event.preventDefault();

	} );

	sceneElement.addEventListener( 'pointerup', ( event ) => {

		const target = event.target;

		// if clicking on empty space
		if ( target === sceneElement ) {

			switch ( event.button ) {

				case 0:
					viewport.detach();
					editor.render();

					this.oldTarget = undefined;
					break;
				case 2:
					const pasteButton = document.createElement( 'DIV' );
					pasteButton.textContent = 'Paste';
					pasteButton.dataset.shortcut = 'Ctrl+V';
					pasteButton.addEventListener( 'pointerup', this.onPaste );
					if ( this.clipboard === undefined )
						pasteButton.dataset.disabled = '';

					contextmenu.append( pasteButton );

					openContextMenu( 1 );

			}

		} else { // if clicking in the scene tree area

			// if clicking on the dropdown button
			if ( target.classList.contains( 'parent' ) && event.clientX - target.getBoundingClientRect().left < parseFloat( window.getComputedStyle( target ).getPropertyValue( 'padding-left' ) ) ) {

				if ( target.dataset.opened !== undefined ) closeParent( target );
				else openParent( target );

			} else {

				// select the entity
				if ( this.oldTarget !== target ) {

					const entity = scene.getEntityById( parseInt( target.dataset.id ) );

					viewport.attach( entity );
					editor.render();

				}

				// if right click, open contextmenu
				if ( event.button === 2 ) {

					const copyButton = document.createElement( 'DIV' );
					copyButton.textContent = 'Copy';
					copyButton.dataset.shortcut = 'Ctrl+C';
					copyButton.addEventListener( 'pointerup', this.onCopy );

					const pasteButton = document.createElement( 'DIV' );
					pasteButton.textContent = 'Paste';
					pasteButton.dataset.shortcut = 'Ctrl+V';
					pasteButton.addEventListener( 'pointerup', this.onPaste );
					if ( this.clipboard === undefined )
						pasteButton.dataset.disabled = '';

					const pasteAsChildButton = document.createElement( 'DIV' );
					pasteAsChildButton.textContent = 'Paste as Child';
					pasteAsChildButton.dataset.shortcut = 'Ctrl+Shift+V';
					pasteAsChildButton.dataset.line = '';
					pasteAsChildButton.addEventListener( 'pointerup', this.onPasteAsChild );
					if ( this.clipboard === undefined )
						pasteAsChildButton.dataset.disabled = '';

					const renameButton = document.createElement( 'DIV' );
					renameButton.textContent = 'Rename';
					renameButton.addEventListener( 'pointerup', this.onRename );

					const cloneButton = document.createElement( 'DIV' );
					cloneButton.textContent = 'Clone';
					cloneButton.dataset.shortcut = 'Ctrl+D';
					cloneButton.addEventListener( 'pointerup', this.onClone );

					const deleteButton = document.createElement( 'DIV' );
					deleteButton.textContent = 'Delete';
					deleteButton.dataset.shortcut = 'Del';
					deleteButton.addEventListener( 'pointerup', this.onDelete );

					contextmenu.append( copyButton, pasteButton, pasteAsChildButton, renameButton, cloneButton, deleteButton );

					openContextMenu( 5 );


				}

			}

		}

	} );

}
