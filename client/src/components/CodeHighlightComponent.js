import hljs from 'highlight.js/lib/common';   // import hljs library
import { useEffect } from 'react';
import '../../node_modules/highlight.js/styles/rainbow.css';

export function CodeHiglightComponent({code, onClick}) {
    useEffect(() => {
        hljs.highlightAll();
    }, [])
    return(<pre>
        <code style={{fontSize: "0.7em"}} onClick={onClick ? onClick : null}>{code}</code>
    </pre>
    )
}