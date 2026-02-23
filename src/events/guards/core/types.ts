export interface Guard {
    
    enter(): boolean;
    leave(): boolean;

    isInside: boolean;
}