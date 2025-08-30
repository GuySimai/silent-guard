"use server";

//my Imports
import { db } from "@/server/db/db";
import { camerasTable, categoriesTable } from "../db/schema";
import {  eq } from "drizzle-orm";



export const getCategoryCameras = async (categoryId : string) => {

       //Checkings to see if the category exists
        const existingCategory = await db.select()
        .from(categoriesTable)
        .where(eq(categoriesTable.id, categoryId));


        if (existingCategory.length === 0) {
          return { error: "Category Does Not Exist!" };
        }

        const cameras = await db.select()
        .from(camerasTable)
        .where(eq(camerasTable.categoryId, categoryId));

        if (cameras.length === 0) {
          return { error: "Category Does Not Have Cameras!" };
        }

        //Mapping the cameras to the format we need

        //Checks to see if the cameras are online
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

        return { success: "Category fetched", cameras: camerasFormatted };

      };

