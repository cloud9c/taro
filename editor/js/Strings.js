function Strings( config ) {

	const language = config.getKey( 'language' );

	const values = {

		en: {

			'menubar/file': 'File',
			'menubar/file/new': 'New',
			'menubar/file/import': 'Import',
			'menubar/file/export/object': 'Export Object',
			'menubar/file/export/scene': 'Export Scene',
			'menubar/file/publish': 'Publish',

			'menubar/edit': 'Edit',
			'menubar/edit/undo': 'Undo (Ctrl+Z)',
			'menubar/edit/redo': 'Redo (Ctrl+Shift+Z)',
			'menubar/edit/clear_history': 'Clear History',
			'menubar/edit/center': 'Center',
			'menubar/edit/clone': 'Clone',
			'menubar/edit/delete': 'Delete (Del)',
			'menubar/edit/fixcolormaps': 'Fix Color Maps',

			'menubar/add': 'Add',
			'menubar/add/group': 'Group',
			'menubar/add/plane': 'Plane',
			'menubar/add/box': 'Box',
			'menubar/add/circle': 'Circle',
			'menubar/add/cylinder': 'Cylinder',
			'menubar/add/ring': 'Ring',
			'menubar/add/sphere': 'Sphere',
			'menubar/add/dodecahedron': 'Dodecahedron',
			'menubar/add/icosahedron': 'Icosahedron',
			'menubar/add/octahedron': 'Octahedron',
			'menubar/add/tetrahedron': 'Tetrahedron',
			'menubar/add/torus': 'Torus',
			'menubar/add/tube': 'Tube',
			'menubar/add/torusknot': 'TorusKnot',
			'menubar/add/lathe': 'Lathe',
			'menubar/add/sprite': 'Sprite',
			'menubar/add/pointlight': 'PointLight',
			'menubar/add/spotlight': 'SpotLight',
			'menubar/add/directionallight': 'DirectionalLight',
			'menubar/add/hemispherelight': 'HemisphereLight',
			'menubar/add/ambientlight': 'AmbientLight',
			'menubar/add/perspectivecamera': 'PerspectiveCamera',
			'menubar/add/orthographiccamera': 'OrthographicCamera',

			'menubar/status/autosave': 'autosave',

			'menubar/play': 'Play',
			'menubar/play/stop': 'Stop',
			'menubar/play/play': 'Play',

			'menubar/examples': 'Examples',
			'menubar/examples/Arkanoid': 'Arkanoid',
			'menubar/examples/Camera': 'Camera',
			'menubar/examples/Particles': 'Particles',
			'menubar/examples/Pong': 'Pong',
			'menubar/examples/Shaders': 'Shaders',

			'menubar/view': 'View',
			'menubar/view/fullscreen': 'Fullscreen',

			'menubar/help': 'Help',
			'menubar/help/source_code': 'Source Code',
			'menubar/help/icons': 'Icon Pack',
			'menubar/help/about': 'About',
			'menubar/help/manual': 'Manual',

			'sidebar/animations': 'Animations',
			'sidebar/animations/play': 'Play',
			'sidebar/animations/stop': 'Stop',
			'sidebar/animations/timescale': 'Time Scale',

			'sidebar/scene': 'Scene',
			'sidebar/scene/background': 'Background',
			'sidebar/scene/environment': 'Environment',
			'sidebar/scene/fog': 'Fog',

			'sidebar/properties/object': 'Object',
			'sidebar/properties/components': 'Components',

			'sidebar/object/name': 'Name',
			'sidebar/object/position': 'Position',
			'sidebar/object/rotation': 'Rotation',
			'sidebar/object/scale': 'Scale',
			'sidebar/object/shadow': 'Shadow',
			'sidebar/object/cast': 'cast',
			'sidebar/object/receive': 'receive',
			'sidebar/object/visible': 'Visible',

			'sidebar/assets': 'Assets',

			'sidebar/settings': 'Settings',
			'sidebar/setting/title': 'Title',
			'sidebar/setting/editable': 'Editable',
			'sidebar/setting/vr': 'VR',
			'sidebar/setting/renderer': 'Renderer',
			'sidebar/setting/antialias': 'Antialias',
			'sidebar/setting/shadows': 'Shadows',
			'sidebar/setting/physicallyCorrectLights': 'Physical lights',
			'sidebar/setting/toneMapping': 'Tone mapping',
			'sidebar/setting/materials': 'Materials',
			'sidebar/setting/Assign': 'Assign',

			'sidebar/setting/video': 'Video',
			'sidebar/setting/resolution': 'Resolution',
			'sidebar/setting/duration': 'Duration',
			'sidebar/setting/render': 'Render',

			'sidebar/settings/language': 'Language',

			'sidebar/settings/shortcuts': 'Shortcuts',
			'sidebar/settings/shortcuts/translate': 'Translate',
			'sidebar/settings/shortcuts/rotate': 'Rotate',
			'sidebar/settings/shortcuts/scale': 'Scale',
			'sidebar/settings/shortcuts/undo': 'Undo',
			'sidebar/settings/shortcuts/focus': 'Focus',

			'sidebar/settings/viewport': 'Viewport',
			'sidebar/settings/viewport/grid': 'Grid',
			'sidebar/settings/viewport/helpers': 'Helpers',

			'sidebar/history': 'History',
			'sidebar/history/persistent': 'persistent',

			'toolbar/translate': 'Translate',
			'toolbar/rotate': 'Rotate',
			'toolbar/scale': 'Scale',
			'toolbar/local': 'Local',

			'viewport/info/objects': 'Objects',
			'viewport/info/vertices': 'Vertices',
			'viewport/info/triangles': 'Triangles',
			'viewport/info/frametime': 'Frametime'

		},

		fr: {

			'menubar/file': 'Fichier',
			'menubar/file/new': 'Nouveau',
			'menubar/file/import': 'Importer',
			'menubar/file/export/object': 'Exporter Objet',
			'menubar/file/export/scene': 'Exporter Scene',
			'menubar/file/publish': 'Publier',

			'menubar/edit': 'Edition',
			'menubar/edit/undo': 'Annuler (Ctrl+Z)',
			'menubar/edit/redo': 'Refaire (Ctrl+Shift+Z)',
			'menubar/edit/clear_history': 'Supprimer Historique',
			'menubar/edit/center': 'Center',
			'menubar/edit/clone': 'Cloner',
			'menubar/edit/delete': 'Supprimer (Supp)',
			'menubar/edit/fixcolormaps': 'Correction des couleurs',

			'menubar/add': 'Ajouter',
			'menubar/add/group': 'Groupe',
			'menubar/add/plane': 'Plan',
			'menubar/add/box': 'Cube',
			'menubar/add/circle': 'Cercle',
			'menubar/add/cylinder': 'Cylindre',
			'menubar/add/ring': 'Bague',
			'menubar/add/sphere': 'Sphère',
			'menubar/add/dodecahedron': 'Dodécaèdre',
			'menubar/add/icosahedron': 'Icosaèdre',
			'menubar/add/octahedron': 'Octaèdre',
			'menubar/add/tetrahedron': 'Tétraèdre',
			'menubar/add/torus': 'Torus',
			'menubar/add/tube': 'Tube',
			'menubar/add/torusknot': 'Noeud Torus',
			'menubar/add/lathe': 'Tour',
			'menubar/add/sprite': 'Sprite',
			'menubar/add/pointlight': 'Lumière ponctuelle',
			'menubar/add/spotlight': 'settingeur',
			'menubar/add/directionallight': 'Lumière directionnelle',
			'menubar/add/hemispherelight': 'Lumière hémisphérique',
			'menubar/add/ambientlight': 'Lumière ambiante',
			'menubar/add/perspectivecamera': 'Caméra perspective',
			'menubar/add/orthographiccamera': 'Caméra orthographique',

			'menubar/status/autosave': 'enregistrement automatique',

			'menubar/play': 'Jouer',
			'menubar/play/stop': 'Arrêter',
			'menubar/play/play': 'Jouer',

			'menubar/examples': 'Exemples',
			'menubar/examples/Arkanoid': 'Arkanoid',
			'menubar/examples/Camera': 'Camera',
			'menubar/examples/Particles': 'Particles',
			'menubar/examples/Pong': 'Pong',
			'menubar/examples/Shaders': 'Shaders',

			'menubar/view': 'View',
			'menubar/view/fullscreen': 'Fullscreen',

			'menubar/help': 'Aide',
			'menubar/help/source_code': 'Code Source',
			'menubar/help/icons': 'Icon Pack',
			'menubar/help/about': 'A propos',
			'menubar/help/manual': 'Manual',

			'sidebar/animations': 'Animations',
			'sidebar/animations/play': 'Play',
			'sidebar/animations/stop': 'Stop',
			'sidebar/animations/timescale': 'Time Scale',

			'sidebar/scene': 'Scène',
			'sidebar/scene/background': 'Arrière Plan',
			'sidebar/scene/environment': 'Environment',
			'sidebar/scene/fog': 'Brouillard',

			'sidebar/properties/object': 'Objet',
			'sidebar/properties/components': 'Composant',

			'sidebar/object/name': 'Nom',
			'sidebar/object/position': 'Position',
			'sidebar/object/rotation': 'Rotation',
			'sidebar/object/scale': 'Échelle',
			'sidebar/object/shadow': 'Ombre',
			'sidebar/object/cast': 'Projète',
			'sidebar/object/receive': 'Reçoit',
			'sidebar/object/visible': 'Visible',

			'sidebar/assets': 'Actifs',

			'sidebar/setting': 'Paramètres',
			'sidebar/setting/title': 'Titre',
			'sidebar/setting/editable': 'Modifiable',
			'sidebar/setting/vr': 'VR',
			'sidebar/setting/renderer': 'Rendus',
			'sidebar/setting/antialias': 'Anticrénelage',
			'sidebar/setting/shadows': 'Ombres',
			'sidebar/setting/physicallyCorrectLights': 'Physical lights',
			'sidebar/setting/toneMapping': 'Mappage des nuances',
			'sidebar/setting/materials': 'Matériaux',
			'sidebar/setting/Assign': 'Attribuer',

			'sidebar/setting/video': 'Video',
			'sidebar/setting/resolution': 'Resolution',
			'sidebar/setting/duration': 'Duration',
			'sidebar/setting/render': 'Render',

			'sidebar/settings/language': 'Langue',

			'sidebar/settings/shortcuts': 'Shortcuts',
			'sidebar/settings/shortcuts/translate': 'Position',
			'sidebar/settings/shortcuts/rotate': 'Rotation',
			'sidebar/settings/shortcuts/scale': 'Échelle',
			'sidebar/settings/shortcuts/undo': 'Annuler',
			'sidebar/settings/shortcuts/focus': 'Focus',

			'sidebar/settings/viewport': 'Viewport',
			'sidebar/settings/viewport/grid': 'Grille',
			'sidebar/settings/viewport/helpers': 'Helpers',

			'sidebar/history': 'Historique',
			'sidebar/history/persistent': 'permanent',

			'toolbar/translate': 'Position',
			'toolbar/rotate': 'Rotation',
			'toolbar/scale': 'Échelle',
			'toolbar/local': 'Local',

			'viewport/info/objects': 'Objets',
			'viewport/info/vertices': 'Sommets',
			'viewport/info/triangles': 'Triangles',
			'viewport/info/frametime': 'Temps de trame'

		},

		zh: {

			'menubar/file': '文件',
			'menubar/file/new': '新建',
			'menubar/file/import': '导入',
			'menubar/file/export/geometry': '导出几何体',
			'menubar/file/export/object': '导出物体',
			'menubar/file/export/scene': '导出场景',
			'menubar/file/export/dae': '导出DAE',
			'menubar/file/export/drc': '导出DRC',
			'menubar/file/export/glb': '导出GLB',
			'menubar/file/export/gltf': '导出GLTF',
			'menubar/file/export/obj': '导出OBJ',
			'menubar/file/export/ply': '导出PLY',
			'menubar/file/export/ply_binary': '导出PLY(二进制)',
			'menubar/file/export/stl': '导出STL',
			'menubar/file/export/stl_binary': '导出STL(二进制)',
			'menubar/file/export/usdz': '导出USDZ',
			'menubar/file/publish': '发布',

			'menubar/edit': '编辑',
			'menubar/edit/undo': '撤销 (Ctrl+Z)',
			'menubar/edit/redo': '重做 (Ctrl+Shift+Z)',
			'menubar/edit/clear_history': '清空历史记录',
			'menubar/edit/center': '居中',
			'menubar/edit/clone': '拷贝',
			'menubar/edit/delete': '删除 (Del)',
			'menubar/edit/fixcolormaps': '修复颜色贴图',

			'menubar/add': '添加',
			'menubar/add/group': '组',
			'menubar/add/plane': '平面',
			'menubar/add/box': '正方体',
			'menubar/add/circle': '圆',
			'menubar/add/cylinder': '圆柱体',
			'menubar/add/ring': '环',
			'menubar/add/sphere': '球体',
			'menubar/add/dodecahedron': '十二面体',
			'menubar/add/icosahedron': '二十面体',
			'menubar/add/octahedron': '八面体',
			'menubar/add/tetrahedron': '四面体',
			'menubar/add/torus': '圆环体',
			'menubar/add/torusknot': '环面纽结体',
			'menubar/add/tube': '管',
			'menubar/add/lathe': '酒杯',
			'menubar/add/sprite': '精灵',
			'menubar/add/pointlight': '点光源',
			'menubar/add/spotlight': '聚光灯',
			'menubar/add/directionallight': '平行光',
			'menubar/add/hemispherelight': '半球光',
			'menubar/add/ambientlight': '环境光',
			'menubar/add/perspectivecamera': '透视相机',
			'menubar/add/orthographiccamera': '正交相机',

			'menubar/status/autosave': '自动保存',

			'menubar/play': '启动',
			'menubar/play/stop': '暂停',
			'menubar/play/play': '启动',

			'menubar/examples': '示例',
			'menubar/examples/Arkanoid': '打砖块',
			'menubar/examples/Camera': ' 摄像机',
			'menubar/examples/Particles': '粒子',
			'menubar/examples/Pong': '乒乓球',
			'menubar/examples/Shaders': '着色器',

			'menubar/view': '视图',
			'menubar/view/fullscreen': '全屏',

			'menubar/help': '帮助',
			'menubar/help/source_code': '源码',
			'menubar/help/icons': '图标组件包',
			'menubar/help/about': '关于',
			'menubar/help/manual': '手册',

			'sidebar/animations': '动画',
			'sidebar/animations/play': '播放',
			'sidebar/animations/stop': '暂停',
			'sidebar/animations/timescale': '时间缩放',

			'sidebar/scene': '场景',
			'sidebar/scene/background': '背景',
			'sidebar/scene/environment': '环境',
			'sidebar/scene/fog': '雾',

			'sidebar/properties/object': '属性',
			'sidebar/properties/components': '组件',

			'sidebar/object/name': '名称',
			'sidebar/object/position': '位置',
			'sidebar/object/rotation': '旋转',
			'sidebar/object/scale': '缩放',
			'sidebar/object/shadow': '阴影',
			'sidebar/object/cast': '产生',
			'sidebar/object/receive': '接受',
			'sidebar/object/visible': '可见性',

			'sidebar/assets': '资产',

			'sidebar/setting': '设置',
			'sidebar/setting/title': '标题',
			'sidebar/setting/editable': '编辑性',
			'sidebar/setting/vr': '虚拟现实',
			'sidebar/setting/renderer': '渲染器',
			'sidebar/setting/antialias': '抗锯齿',
			'sidebar/setting/shadows': '阴影',
			'sidebar/setting/physicallyCorrectLights': '物理灯',
			'sidebar/setting/toneMapping': '色调映射',
			'sidebar/setting/materials': '材质',
			'sidebar/setting/Assign': '应用',

			'sidebar/setting/video': '视频',
			'sidebar/setting/resolution': '分辨率',
			'sidebar/setting/duration': '时长',
			'sidebar/setting/render': '渲染',

			'sidebar/settings/language': '语言',

			'sidebar/settings/shortcuts': '快捷键',
			'sidebar/settings/shortcuts/translate': '移动',
			'sidebar/settings/shortcuts/rotate': '旋转',
			'sidebar/settings/shortcuts/scale': '缩放',
			'sidebar/settings/shortcuts/undo': '撤销',
			'sidebar/settings/shortcuts/focus': '聚焦',

			'sidebar/settings/viewport': '视窗',
			'sidebar/settings/viewport/grid': '网格',
			'sidebar/settings/viewport/helpers': '辅助',

			'sidebar/history': '历史记录',
			'sidebar/history/persistent': '本地存储',

			'toolbar/translate': '移动',
			'toolbar/rotate': '旋转',
			'toolbar/scale': '缩放',
			'toolbar/local': '本地',

			'viewport/info/objects': '物体',
			'viewport/info/vertices': '顶点',
			'viewport/info/triangles': '三角形',
			'viewport/info/frametime': '帧时'

		}

	};

	return {

		getKey: function ( key ) {

			return values[ language ][ key ] || '???';

		}

	};

}

export { Strings };
