;(() => {
	const keyword = () => /\b(var|let|const|function|this|do|super|constructor|instanceof|default)\b/g
	const special_keyword = () =>
		/\b(typeof|try|catch|finally|delete|switch|case|in|of|if|else|import|from|as|export|class|extends|new|return|throw|for|while|break|continue|async|await)\b/g
	const special = () =>
		/\b(window|document|self|top|process|require|module|define|global|Promise|Array|String|Number|Symbol|Function|Reflect|Proxy|Error)\b/g
	const dqstring = () => /("[^"\n\\]*(:?\\.[^"\n\\]*)*")/g
	const sqstring = () => /('[^'\n\\]*(:?\\.[^'\n\\]*)*')/g
	const number = () => /(\d+\.?\d+?)/g
	const bool = () => /(true|false)/g
	const null_ = () => /(null)/g
	const undefined_ = () => /(undefined)/g
	const single_comment = () => /(\/\/[^\n]*)/g
	const multiple_comment = () => /(\/\*[\s\S]*?\*\/)/g
	const function_call = () => /(\w[A-Za-z0-9]*)(?=\()/g
	const operator = () => /([\b\s\[\{\(])(=|[!=]=|[!=]==|\+\+?|--?|\*|\/|&&|\|\||!|<=?|>=?|>>|<<|\.\.\.)([\b\s\w])/g
	const arrow = () => /(=>)/g
	const typenotation = () => /%(\w+)%{=([\s\S]*?)=}%/g
	const x = s => s.replace(typenotation(), '$2') // strip typenotation
	const COLORMAP = {
		kw: '#78dce8',
		ar: '#78dce8',
		skw: '#f92672',
		op: '#f92672',
		fnc: '#a6e22e',
		spc: '#fd971f',
		num: '#ae81ff',
		bool: '#ae81ff',
		null: '#ae81ff',
		ud: '#ae81ff',
		str: '#e6db74',
		cmt: '#75715e'
	}
	const highlight = (str, mode = 'standalone') => {
		str = str.replace(operator(), (m, g1, g2, g3) => `${g1}%op%{=${x(g2)}=}%${g3}`)
		str = str.replace(keyword(), (m, g1) => `%kw%{=${x(g1)}=}%`)
		str = str.replace(arrow(), (m, g1) => `%ar%{=${x(g1)}=}%`)
		str = str.replace(special_keyword(), (m, g1) => `%skw%{=${x(g1)}=}%`)
		str = str.replace(special(), (m, g1) => `%spc%{=${x(g1)}=}%`)
		str = str.replace(function_call(), (m, g1) => `%fnc%{=${x(g1)}=}%`)
		str = str.replace(number(), (m, g1) => `%num%{=${x(g1)}=}%`)
		str = str.replace(bool(), (m, g1) => `%bool%{=${x(g1)}=}%`)
		str = str.replace(null_(), (m, g1) => `%null%{=${x(g1)}=}%`)
		str = str.replace(undefined_(), (m, g1) => `%ud%{=${x(g1)}=}%`)
		str = str.replace(dqstring(), (m, g1) => `%str%{=${x(g1)}=}%`)
		str = str.replace(sqstring(), (m, g1) => `%str%{=${x(g1)}=}%`)
		str = str.replace(single_comment(), (m, g1) => `%cmt%{=${x(g1)}=}%`)
		str = str.replace(multiple_comment(), (m, g1) => `%cmt%{=${x(g1)}=}%`)
		str = str.replace(/</g, '&lt;') // escape `<`
		if (mode === 'standalone') {
			const code = str.replace(typenotation(), (m, g1, g2) => `<span style="color:${COLORMAP[g1]};">${g2}</span>`)
			return `<pre style="tab-size:4;padding:1em;background-color:#2c292d;color:#f8f8f2;"><code>${code}</code></pre>`
		} else if (mode === 'raw') {
			return str
		} else if (mode === 'external') {
			const code = str.replace(typenotation(), '<span class="$1">$2</span>')
			return `<pre class="hl"><code>${code}</code></pre>`
		} else {
			throw new Error('Unknown mode!')
		}
	}
	window.highlight = highlight
})()
