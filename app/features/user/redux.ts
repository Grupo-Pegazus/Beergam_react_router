import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { cryptoUser } from "../auth/utils";
import { type IColab } from "../user/typings/Colab";
import { type IUser } from "../user/typings/User";
import { isMaster } from "./utils";

interface IUserState {
  user: IUser | null | IColab;
}

const initialState: IUserState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUserInfo(
      state,
      action: PayloadAction<{
        user: IUser | IColab;
        shouldEncrypt?: boolean | undefined;
      }>
    ) {
      const shouldEncrypt = action.payload.shouldEncrypt ?? true;
      let auxColabs: Record<string, IColab> = {};
      if (state.user && isMaster(state.user)) {
        auxColabs = state.user.colabs ?? {}; //Salvar valor antigo dos colaboradores caso o payload não tanha os colaboradores (nem toda rota do backend manda essas informações)
      }
      if (isMaster(action.payload.user) && action.payload.user.colabs) {
        //Atualizar valor dos colaboradores caso o payload tenha os colaboradores
        auxColabs = action.payload.user.colabs;
      }
      const userToUpdate = isMaster(action.payload.user)
        ? { ...action.payload.user, colabs: auxColabs }
        : action.payload.user;
      state.user = userToUpdate;
      if (shouldEncrypt) {
        cryptoUser.encriptarDados(userToUpdate);
      }
    },
    updateColab(state, action: PayloadAction<IColab>) {
      if (state.user && isMaster(state.user)) {
        if (state.user.colabs && action.payload.pin) {
          state.user.colabs[action.payload.pin] = action.payload;
          userSlice.caseReducers.updateUserInfo(state, {
            payload: { user: state.user, shouldEncrypt: true },
            type: "updateUserInfo",
          });
        }
      }
    },
    updateColabs(state, action: PayloadAction<Record<string, IColab>>) {
      if (state.user && isMaster(state.user)) {
        state.user.colabs = action.payload;
        userSlice.caseReducers.updateUserInfo(state, {
          payload: { user: state.user, shouldEncrypt: true },
          type: "updateUserInfo",
        });
      }
    },
  },
});

export const { updateUserInfo, updateColab, updateColabs } = userSlice.actions;
export default userSlice.reducer;
