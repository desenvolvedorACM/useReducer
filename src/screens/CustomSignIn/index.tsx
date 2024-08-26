import React, { useReducer } from "react";
import { SafeAreaView, View } from "react-native";
import { Text, TextInput, Button, useTheme, Avatar } from "react-native-paper";
import { SighIn } from "../../services/signing.service";
import { styles } from "./styles";
import { ActionType, AppState, IReducerType } from "../../models";
import { ERROR, FIELD, LOGIN, LOGOUT, SUCCESS } from "../../constants";

const initialState: IReducerType = {
  email: "",
  password: "",
  error: "",
  isLoggedIn: false,
  isLoading: false,
};

const SignInReducer = (state: AppState, action: ActionType) => {
  switch (action.type) {
    case FIELD: {
      return {
        ...state,
        [action.field]: action.value,
      };
    }
    case LOGIN: {
      return {
        ...state,
        isLoading: true,
        error: "",
      };
    }
    case SUCCESS: {
      return {
        ...state,
        isLoading: false,
        isLoggedIn: true,
        error: "",
      };
    }
    case ERROR: {
      return {
        ...state,
        isLoading: false,
        isLoggedIn: false,
        error: action.error,
      };
    }
    case LOGOUT: {
      return {
        ...state,
        email: "",
        password: "",
        isLoggedIn: false,
      };
    }
    default:
      return state;
  }
};

export default function CustomSignIn() {
  const [state, dispatch] = useReducer(SignInReducer, initialState);
  const theme = useTheme();

  const { email, password, isLoggedIn, isLoading, error } = state;

  const onSuccess = () => {
    return dispatch({
      type: SUCCESS,
      field: "",
      value: "",
      error: "",
    });
  };

  const onSignIn = async () => {
    if (email == "" && password == "") {
      dispatch({
        type: ERROR,
        error: "Email and Password is required",
        field: "",
        value: "",
      });
      return;
    }

    dispatch({
      type: LOGIN,
      field: "",
      value: "",
      error: "",
    });

    try {
      await SighIn(email.toLowerCase(), password.toLowerCase());

      onSuccess();
    } catch (err: any) {
      dispatch({
        type: ERROR,
        error: err,
        field: "",
        value: "",
      });
    }
  };

  const onLogout = () => {
    dispatch({
      type: LOGOUT,
      field: "",
      value: "",
      error: "",
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 10, backgroundColor: "#F3F3F3" }}>
      {isLoggedIn ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text variant="headlineLarge">Welcome, {email}</Text>
          <Button mode="contained" onPress={onLogout}>
            <Text style={styles.text} variant="bodyLarge">
              Logout
            </Text>
          </Button>
        </View>
      ) : (
        <>
          <View style={styles.containerLogo}>
            <Avatar.Image
              size={100}
              source={require("../../assets/unlock.jpeg")}
            />
          </View>
          <View style={styles.containerForm}>
            <Text style={{ textAlign: "center" }} variant="headlineMedium">
              Please, Sign In
            </Text>

            <TextInput
              mode="outlined"
              label="Email"
              value={email}
              onChangeText={(value) =>
                dispatch({
                  type: "field",
                  field: "email",
                  value: value,
                  error: "",
                })
              }
              style={styles.input}
            />
            <TextInput
              secureTextEntry
              mode="outlined"
              label="Password"
              value={password}
              onChangeText={(value) =>
                dispatch({
                  type: "field",
                  field: "password",
                  value: value,
                  error: "",
                })
              }
              style={styles.input}
              error={isLoggedIn}
            />

            {error && (
              <Text style={styles.error} variant="titleSmall">
                {error}
              </Text>
            )}

            <Button mode="contained" onPress={onSignIn}>
              <Text
                style={{ color: theme.colors.text.secondary }}
                variant="bodyLarge"
              >
                {isLoading ? "Loading..." : "Sign In"}
              </Text>
            </Button>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
