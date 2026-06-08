import { useRef, useEffect, useState, useMemo, useId } from 'react';

const CommentsLoop = ({
  comments = [
    'comentario reseña',
    'comentario reseña',
    'comentario reseña',
    'comentario reseña',
    'comentario reseña'
  ],
  speed = 2,
  className,
  direction = 'left',
  interactive = true
}) => {
  const containerRef = useRef(null);
  const [offset, setOffset] = useState(0);

  const dragRef = useRef(false);
  const lastXRef = useRef(0);
  const dirRef = useRef(direction);
  const velRef = useRef(0);

  useEffect(() => {
    let frame = 0;
    const step = () => {
      if (!dragRef.current) {
        const delta = dirRef.current === 'right' ? speed : -speed;
        setOffset(prev => {
          let newOffset = prev + delta;
          const containerWidth = containerRef.current?.scrollWidth || 1;
          const visibleWidth = containerRef.current?.clientWidth || 1;
          
          if (newOffset <= -containerWidth + visibleWidth) {
            newOffset = 0;
          }
          if (newOffset > 0) {
            newOffset = -(containerWidth - visibleWidth);
          }
          
          return newOffset;
        });
      }
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [speed]);

  const onPointerDown = e => {
    if (!interactive) return;
    dragRef.current = true;
    lastXRef.current = e.clientX;
    velRef.current = 0;
    e.target.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = e => {
    if (!interactive || !dragRef.current) return;
    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    velRef.current = dx;
    setOffset(prev => prev + dx);
  };

  const endDrag = () => {
    if (!interactive) return;
    dragRef.current = false;
    dirRef.current = velRef.current > 0 ? 'right' : 'left';
  };

  const cursorStyle = interactive ? (dragRef.current ? 'grabbing' : 'grab') : 'auto';

  return (
    <div className="relative w-full max-w-full overflow-hidden" style={{ cursor: cursorStyle }}>
      {/* Fade izquierda */}
      <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 md:w-24 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
      
      {/* Fade derecha */}
      <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 md:w-24 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

      {/* Contenedor de comentarios */}
      <div
        ref={containerRef}
        className="flex gap-3 sm:gap-4 py-4 sm:py-6 px-2 sm:px-4"
        style={{
          transform: `translateX(${offset}px)`,
          transition: dragRef.current ? 'none' : 'transform 0.05s linear'
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
      >
        {[...comments, ...comments, ...comments].map((comment, idx) => (
        <div
            key={idx}
            className="flex-shrink-0 w-[min(85vw,250px)] sm:w-[280px] md:w-[320px] bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-3 sm:p-4 shadow-lg hover:scale-[1.02] transition-all duration-300"
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                {comment.name.charAt(0)}
            </div>
            <div>
                <p className="text-white text-sm font-semibold">{comment.name}</p>
                <p className="text-gray-400 text-xs">{comment.career}</p>
            </div>
            </div>

            {/* Rating */}
            <div className="flex mb-2">
            {Array.from({ length: comment.rating }).map((_, i) => (
                <span key={i} className="text-yellow-400">★</span>
            ))}
            </div>

            {/* Texto */}
            <p className="text-gray-200 text-sm leading-relaxed">
            {comment.text}
            </p>
        </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsLoop;
