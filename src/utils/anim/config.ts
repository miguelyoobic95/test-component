
export function isAnimationsDisabled(): boolean {
    try {
        return (window as any).localStorage.getItem('disableAnimation') === 'true';
    } catch (err) { }
    return false;
}