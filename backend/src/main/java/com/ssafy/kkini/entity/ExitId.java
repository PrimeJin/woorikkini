package com.ssafy.kkini.entity;


import java.io.Serializable;


public class ExitId implements Serializable {
    private int outcaster;
    private int roomId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        ExitId exitId = (ExitId) o;

        if (outcaster != exitId.outcaster) return false;
        return roomId == exitId.roomId;
    }

    @Override
    public int hashCode() {
        int result = outcaster;
        result = 31 * result + roomId;
        return result;
    }
}
