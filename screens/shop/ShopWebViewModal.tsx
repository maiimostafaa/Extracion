// README
// Shop WebView Modal for displaying an embedded Shopify storefront.
// Features:
// - Fullscreen modal with a header containing close, back, and reload buttons.
// - WebView that loads the Shopify store.
// - Loading indicator while pages load.
// - Error state with retry option when the store cannot be loaded.
// Notes:
// - Uses react-native-webview for rendering the store.
// - Tracks navigation state to enable/disable back navigation.
// - All state resets when the modal is closed.

// -------------------- Imports --------------------
import React, { useState, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";

// -------------------- Props --------------------
interface ShopWebViewModalProps {
  visible: boolean; // Whether the modal is visible
  onClose: () => void; // Function to close the modal
}

// -------------------- Component --------------------
export default function ShopWebViewModal({
  visible,
  onClose,
}: ShopWebViewModalProps) {
  // State variables for UI control
  const [loading, setLoading] = useState(false); // Controls loading spinner visibility
  const [error, setError] = useState(false); // Tracks if an error occurred
  const [canGoBack, setCanGoBack] = useState(false); // Tracks if WebView can navigate back
  const webViewRef = useRef<WebView | null>(null); // Ref to control the WebView

  // -------------------- Handlers --------------------
  const handleLoadStart = () => {
    console.log("WebView: Load Start");
    setLoading(true);
    setError(false);
  };

  const handleLoadEnd = () => {
    console.log("WebView: Load End");
    setLoading(false);
  };

  const handleError = () => {
    console.log("WebView: Error occurred");
    setLoading(false);
    setError(true);
  };

  const handleNavigationStateChange = (navState: any) => {
    console.log("WebView: Navigation state change", {
      url: navState.url,
      loading: navState.loading,
      canGoBack: navState.canGoBack,
      canGoForward: navState.canGoForward,
    });
    setCanGoBack(navState.canGoBack); // Update back navigation availability
    setLoading(navState.loading); // Keep loading state in sync with WebView
  };

  const handleLoadProgress = ({ nativeEvent }: any) => {
    console.log("WebView: Load progress", nativeEvent.progress);
    if (nativeEvent.progress === 1) {
      console.log("WebView: Progress reached 100%, ensuring loading stops");
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    if (webViewRef.current && canGoBack) {
      console.log("WebView: Going back");
      webViewRef.current.goBack();
    }
  };

  const handleReload = () => {
    if (webViewRef.current) {
      webViewRef.current.reload();
      setError(false);
    }
  };

  const handleClose = () => {
    // Reset all state when closing modal
    setLoading(false);
    setError(false);
    setCanGoBack(false);
    onClose();
  };

  // -------------------- Render --------------------
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />

        {/* ---------- Header ---------- */}
        <View style={styles.header}>
          {/* Close button */}
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>

          {/* Header title */}
          <Text style={styles.headerTitle}>Extracion Shop</Text>

          {/* Back + Reload buttons */}
          <View style={styles.headerActions}>
            {canGoBack && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleGoBack}
              >
                <Ionicons name="arrow-back" size={24} color="#333" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.reloadButton}
              onPress={handleReload}
            >
              <Ionicons name="refresh" size={20} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ---------- Loading Indicator ---------- */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#8CDBED" />
            <Text style={styles.loadingText}>Loading shop...</Text>
          </View>
        )}

        {/* ---------- Error State ---------- */}
        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="warning-outline" size={48} color="#FF6B6B" />
            <Text style={styles.errorTitle}>Unable to load shop</Text>
            <Text style={styles.errorMessage}>
              Please check your internet connection and try again.
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={handleReload}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ---------- WebView ---------- */}
        {!error && (
          <WebView
            ref={webViewRef}
            source={{ uri: "https://0hyx14-11.myshopify.com/" }}
            style={styles.webView}
            onLoadStart={handleLoadStart}
            onLoadEnd={handleLoadEnd}
            onLoadProgress={handleLoadProgress}
            onError={handleError}
            onNavigationStateChange={handleNavigationStateChange}
            startInLoadingState={false}
            scalesPageToFit={false}
            allowsBackForwardNavigationGestures={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            sharedCookiesEnabled={true}
            thirdPartyCookiesEnabled={true}
            scrollEnabled={true}
            bounces={true}
            showsVerticalScrollIndicator={true}
            showsHorizontalScrollIndicator={false}
            decelerationRate="normal"
            contentInsetAdjustmentBehavior="automatic"
            onHttpError={({ nativeEvent }) => {
              console.warn("WebView HTTP error: ", nativeEvent);
              handleError();
            }}
            onRenderProcessGone={({ nativeEvent }) => {
              console.warn("WebView render process gone: ", nativeEvent);
              handleError();
            }}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
}

// -------------------- Styles --------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    backgroundColor: "#fff",
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 16,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  reloadButton: {
    padding: 8,
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    position: "absolute",
    top: 120,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    zIndex: 1,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
    fontFamily: "cardRegular",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    backgroundColor: "#fff",
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  errorMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: "#8CDBED",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});
