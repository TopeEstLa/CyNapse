package io.squid.cynapse.enums;

/**
 * @author TopeEstLa
 */
public enum Role {

    USER(1),
    ADMIN(10);

    private int weight;

    Role(int weight) {
        this.weight = weight;
    }

    public int getWeight() {
        return weight;
    }

}
