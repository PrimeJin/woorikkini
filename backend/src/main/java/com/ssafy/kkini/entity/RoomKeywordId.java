package com.ssafy.kkini.entity;

import java.io.Serializable;

public class RoomKeywordId implements Serializable {
    private int roomId;
    private int keywordId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        RoomKeywordId that = (RoomKeywordId) o;

        if (roomId != that.roomId) return false;
        return keywordId == that.keywordId;
    }

    @Override
    public int hashCode() {
        int result = roomId;
        result = 31 * result + keywordId;
        return result;
    }
}
