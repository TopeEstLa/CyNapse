package io.squid.cynapse.enums;

/**
 * @author TopeEstLa
 */
public enum Role {

    USER(1),
    ADVANCED(10),
    EXPERT(20),
    ADMIN(100);

    private final int weight;

    Role(int weight) {
        this.weight = weight;
    }

    public int getWeight() {
        return weight;
    }

}
