package com.ssafy.kkini.repository;



import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.kkini.dto.RoomPasswordXDto;
import com.ssafy.kkini.dto.RoomSearchDto;
import com.ssafy.kkini.entity.QKeyword;
import com.ssafy.kkini.entity.QRoom;
import com.ssafy.kkini.entity.QRoomKeyword;

import javax.persistence.EntityManager;
import java.util.List;

import static com.ssafy.kkini.entity.QRoom.room;

public class RoomCustomRepositoryImpl implements RoomCustomRepository{
    private JPAQueryFactory queryFactory;

    public RoomCustomRepositoryImpl(EntityManager em) {
        this.queryFactory = new JPAQueryFactory(em);
    }

    @Override
    public List<RoomPasswordXDto> searchRoom(RoomSearchDto roomSearchDto) {
        if(roomSearchDto.getSubject().equals("title")){
            return queryFactory
                    .select(Projections.constructor(RoomPasswordXDto.class,
                            room))
                    .from(room)
                    .where(roomTitleContains(roomSearchDto.getContent()))
                    .fetch();
        } else if(roomSearchDto.getSubject().equals("keyword")){
            QKeyword k = new QKeyword("k");
            QRoomKeyword rk = new QRoomKeyword("rk");
            QRoom r= new QRoom("r");
            return queryFactory.select(Projections.constructor(RoomPasswordXDto.class,
                            r))
                    .from(rk)
                    .innerJoin(rk.roomId, r)
                    .innerJoin(rk.keywordId, k)
                    .where(k.keyword.contains(roomSearchDto.getContent()))
                    .fetch();
        }
        return null;
    }
    private BooleanExpression roomTitleContains(String title) {
        return room.roomTitle.contains(title);
    }

}
