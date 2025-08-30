"use server";

//my Imports
import { db } from "@/server/db/db";
import { camerasTable, usersTable } from "../db/schema";
import {  eq } from "drizzle-orm";

export const getCameras = async (userId:string) => {

       //Checkings to see if the category exists
        const existingUser = await db.select()
        .from(usersTable)
        .where(eq(usersTable.id, userId));


        if (existingUser.length === 0) {
          return { error: "User Does Not Exist!" };
        }

        const cameras = await db.select()
        .from(camerasTable)
        .where(eq(camerasTable.userId, userId));

        if (cameras.length === 0) {
          return { error: "User Does Not Have Cameras!" };
        }

        //Mapping the cameras to the format we need
        const camerasFormatted = cameras.map((camera) => {

          let status: 'online' | 'offline' = 'offline';
          
          //Checks to see if the cameras are online
          if(camera.connectionUrl){
            status = 'online';
          }
          
          const fullUrl = camera.connectionUrl + '/video';
          
          return {
          id: camera.id,
          name: camera.name,
          status,
          url: fullUrl,
          category: camera.categoryId
        }
      })

        return { success: "Cameras fetched", cameras: camerasFormatted };

      };