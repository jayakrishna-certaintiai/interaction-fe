import { useEffect, useRef, useState } from "react";

const useInteractionObserver = () => {
    const ref = useRef();
    const [isIntersecting, setIsIntersecting] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsIntersecting(entry.isIntersecting);
            }, {
                rootMargin: '0px',
                threshold: 0.1,
            }
        );
    }, [])
}