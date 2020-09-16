import { StyleSheet } from "react-native";

const formStyles = StyleSheet.create({
  space: {
    color: "#C0C0C0",
    fontSize: 15,
    textAlign: "justify",
  },
  errorInput: {
    color: "#D84444",
    textAlign: "left",
    marginBottom: 0,
    marginTop: 0,
  },
  noBorder: {
    borderBottomWidth: 0,
  },
});

const listStyles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  backTextWhite: {
    color: "#FFF",
  },
  rowFront: {
    alignItems: "flex-start",
    backgroundColor: "white",
    borderBottomColor: "#4f73f2",
    borderBottomWidth: 1,
    justifyContent: "center",
    height: 100,
    paddingLeft: 15,
    paddingRight: 15,
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: "#DDD",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: 75,
  },
  backRightBtnLeft: {
    backgroundColor: "#4f73f2",
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: "#d84343",
    right: 0,
  },
  item: {
    flexDirection: "row",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 20,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 5,
    borderBottomColor: "#4f73f2",
    borderBottomWidth: 1,
  },
  homeButton: {
    color: "white",
    fontSize: 18,
  },
});

export { formStyles, listStyles };
